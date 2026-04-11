const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const issueController = require('../controllers/issueController');

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});
const upload = multer({ storage: storage });

router.get('/:tenderId', issueController.getIssuesByTender);
router.post('/:tenderId', upload.single('proofImage'), issueController.reportIssue);

module.exports = router;
