const express = require('express');
const auth = require('../middleware/Auth');

const router = express.Router();

// Simple base64 image upload
router.post('/image', auth, async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // In production, you would upload to Cloudinary or S3
    // For now, we'll just return the base64 image
    res.json({ 
      url: image,
      message: 'Image uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;