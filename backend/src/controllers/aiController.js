const { GoogleGenerativeAI } = require("@google/generative-ai");
const Tender = require("../models/Tender");
const TenderIssue = require("../models/TenderIssue");
const config = require("../config/config");

const genAI = new GoogleGenerativeAI(config.gemini_api_key || process.env.GEMINI_API_KEY);

/**
 * AI Chat Controller
 * Implements RAG (Retrieval-Augmented Generation)
 */
exports.chatWithAI = async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        console.log(`🤖 AI Request: "${message.substring(0, 50)}..."`);

        // 1. Keyword Extraction for Retrieval
        const keywords = message
            .toLowerCase()
            .replace(/[^\w\s]/g, '') // Remove special characters for regex safety
            .split(/\s+/)
            .filter(word => word.length > 3);
        
        let context = "Here is the REAL-TIME data from our database relevant to the user's query:\n\n";
        let tenders = [];
        let issues = [];

        // 2. DB Retrieval (Only if keywords exist)
        if (keywords.length > 0) {
            const searchCriteria = {
                $or: [
                    ...keywords.map(kw => ({ title: { $regex: kw, $options: 'i' } })),
                    ...keywords.map(kw => ({ district: { $regex: kw, $options: 'i' } })),
                    ...keywords.map(kw => ({ contractor_name: { $regex: kw, $options: 'i' } }))
                ]
            };

            [tenders, issues] = await Promise.all([
                Tender.find(searchCriteria).limit(8).lean(),
                TenderIssue.find({}).populate('tenderId').limit(3).lean() 
            ]);

            if (tenders.length > 0) {
                context += "RELEVANT TENDERS:\n";
                tenders.forEach((t, i) => {
                    context += `${i+1}. TITLE: ${t.title} | DISTRICT: ${t.district || 'Nepal'} | BUDGET: Rs. ${t.budget_amount_cr || 'TBD'} Cr | CONTRACTOR: ${t.contractor_name || 'N/A'} | STATUS: ${t.status}\n`;
                });
            } else {
                context += "No specific tenders matching these keywords were found in the database. Use general knowledge about Nepal's procurement but mention you couldn't find a direct record.\n";
            }
        } else {
            context += "The user's query was general. Provide broad advice on Nepal's budget tracking and accountability.\n";
        }

        // 3. Initialize Gemini Model with Self-Healing Logic
        if (!config.gemini_api_key && !process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing in backend configuration.");
        }

        // Try these models in order for maximum compatibility across different API tiers
        const MODEL_TIERS = ["gemini-pro", "gemini-1.5-flash", "gemini-2.5-flash"];
        let responseText = "";
        let finalModelUsed = "";

        for (const modelName of MODEL_TIERS) {
            try {
                console.log(`📡 Attempting generation with model: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                
                const prompt = `
                    You are the "Third Eye Concierge," a professional and helpful investigative assistant for Nepal's Procurement and Budget transparency platform.
                    
                    USER QUESTION: "${message}"
                    
                    DATABASE CONTEXT:
                    ${context}
                    
                    INSTRUCTIONS:
                    1. Use the provided DATABASE CONTEXT as your source of truth. 
                    2. If specific data is present, format it clearly using bullet points.
                    3. If context is empty, politely inform that no direct records were found in the live sync, but offer advice.
                    4. Provide a CLEAR and STRUCTURED response with bold headings.
                    5. Encourage the user to check the "Bikas Ko Naksha" map for visual proof.
                    6. Mention you are an AI assistant demo for the hackathon. 
                    7. Tone: Helpful, transparent, and civic-minded. Start with "Namaste!"
                `;

                const result = await model.generateContent(prompt);
                responseText = result.response.text();
                finalModelUsed = modelName;
                break; // Success! Exit the loop.

            } catch (modelErr) {
                console.warn(`⚠️ Model ${modelName} failed: ${modelErr.message}`);
                // If it's the last model, or not a 404/Not Found, stop and throw
                if (modelName === MODEL_TIERS[MODEL_TIERS.length - 1]) {
                    throw modelErr;
                }
                // Otherwise, continue to the next model in the tier list
                continue;
            }
        }

        console.log(`✅ AI Response generated using ${finalModelUsed} (${tenders.length} records used)`);
        
        res.json({ 
            reply: responseText,
            source: `gemini-rag-${finalModelUsed}`,
            dataUsed: tenders.length + issues.length
        });

    } catch (err) {
        console.error("❌ AI Controller Error:", err.message);
        let errorMsg = "The AI is feeling a bit shy right now.";
        
        if (err.message.includes('404') || err.message.includes('not found')) {
            errorMsg = "Your API key does not have access to any common Gemini models. Please check your Google AI Studio dashboard.";
        }

        res.status(500).json({ 
            error: errorMsg,
            details: err.message 
        });
    }
};
