const TenderIssue = require('../models/TenderIssue');
const path = require('path');

exports.reportIssue = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const { title, description, category } = req.body;
    
    // multer adds the file reference to req.file
    let proofImageUrl = null;
    if (req.file) {
      proofImageUrl = `/uploads/${req.file.filename}`;
    }

    const issue = new TenderIssue({
      tenderId,
      title,
      description,
      category,
      proofImageUrl
    });

    await issue.save();
    res.status(201).json({ message: 'Issue reported successfully', data: issue });
  } catch (error) {
    console.error('Report issue error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getIssuesByTender = async (req, res) => {
  try {
    const { tenderId } = req.params;
    const issues = await TenderIssue.find({ tenderId }).sort({ createdAt: -1 });
    res.json({ data: issues });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
