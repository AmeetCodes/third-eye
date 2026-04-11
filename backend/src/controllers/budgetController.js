const fs = require('fs');
const path = require('path');
const Tender = require('../models/Tender');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Helper to load static data
const loadJSON = (filename) => {
    try {
        const filePath = path.join(__dirname, '../data', filename);
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
        console.error(`Error loading ${filename}:`, err);
        return null;
    }
};

/**
 * @desc Get Budget Data for Dashboard
 */
exports.getBudgetData = (req, res) => {
    const budget = loadJSON('budget_2082_83.json');
    if (!budget) return res.status(404).json({ message: 'Budget data not found' });
    res.json(budget);
};

/**
 * @desc Handle AI Chat Queries (RAG with Gemini)
 */
exports.handleChat = async (req, res) => {
    const { query, history } = req.body;
    
    if (!query) return res.status(400).json({ message: 'Query is required' });

    try {
        const budgetData = loadJSON('budget_2082_83.json');
        
        // 1. Context Retrieval (RAG)
        let context = "You are the 'Third Eye Concierge', a helpful assistant for Nepal's Procurement and Budget system.";
        let retrievedTenders = [];

        // Search for relevant tenders based on the query keywords
        const keywords = query.toLowerCase().split(' ').filter(word => word.length > 3);
        if (keywords.length > 0) {
            retrievedTenders = await Tender.find({
                $or: [
                    { title: { $regex: keywords.join('|'), $options: 'i' } },
                    { public_entity_name: { $regex: keywords.join('|'), $options: 'i' } },
                    { district: { $regex: keywords.join('|'), $options: 'i' } }
                ]
            }).sort({ submission_date: 1 }).limit(5);
        }

        // If no specific match, just get the most recent ones
        if (retrievedTenders.length === 0 && (query.toLowerCase().includes('tender') || query.toLowerCase().includes('bolpatra'))) {
            retrievedTenders = await Tender.find({ status: 'OPEN' }).sort({ createdAt: -1 }).limit(5);
        }

        // Add Tender context
        if (retrievedTenders.length > 0) {
            context += "\n\nRelevant Tenders found in our Database:";
            retrievedTenders.forEach(t => {
                context += `\n- Title: ${t.title}\n  Entity: ${t.public_entity_name}\n  Deadline: ${t.submission_date ? t.submission_date.toDateString() : 'N/A'}\n  Remaining: ${t.remaining_days} days\n  District: ${t.district}`;
            });
        }

        // Add Budget context if relevant
        if (query.toLowerCase().includes('budget') || query.toLowerCase().includes('tax') || query.toLowerCase().includes('nepal')) {
            context += `\n\nBudget 2082/83 Policy Context: ${JSON.stringify(budgetData.metadata)}\nTax Highlights: ${JSON.stringify(budgetData.tax_highlights)}`;
        }

        // 2. AI Generation
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (apiKey) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
                Context: ${context}
                
                Instruction: Answer the user's question based on the provided context. 
                If the question is about specific tenders, mention their names and deadlines clearly.
                Keep the tone professional and helpful.
                
                User Query: ${query}
                Response:
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            res.json({
                response: responseText,
                context_used: true,
                source: "Gemini AI"
            });
        } else {
            // Fallback: Smart Rule-based responses with retrieved data
            let response = "";
            
            if (retrievedTenders.length > 0) {
                const first = retrievedTenders[0];
                response = `I found a relevant tender: "${first.title}" by ${first.public_entity_name}. The submission deadline is ${first.submission_date ? first.submission_date.toDateString() : 'not specified'} (${first.remaining_days} days remaining).`;
            } else if (query.toLowerCase().includes('tax benefit')) {
                response = "According to the Budget 2082/83, startups with annual transactions under NPR 10 crore get a 100% tax exemption for 5 years.";
            } else {
                response = "I have access to the Federal Budget and live Tender listings. Could you be more specific about the project or policy you're looking for?";
            }

            res.json({
                response,
                context_used: true,
                note: "Offline/Mock mode due to missing API Key."
            });
        }

    } catch (err) {
        console.error('Chat error:', err);
        res.status(500).json({ message: 'Internal server error while processing AI request' });
    }
};
