const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// GET /api/hello
router.get('/hello', async (req, res) => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    res.json({ message: 'Hello from Express inside Next.js!', collections });
    console.log('/api/hello called, collections:', collections);
  } catch (err) {
    console.error('Error listing collections:', err);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

module.exports = router;
