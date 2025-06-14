const express = require('express');
const next = require('next');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/modulunchdb';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

app.prepare().then(() => {
  const server = express();

  server.get('/api/hello', async (req, res) => {
    try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      res.json({ message: 'Hello from Express inside Next.js!', collections });
      console.log('/api/hello called, collections:', collections);
    } catch (err) {
      console.error('Error listing collections:', err);
      res.status(500).json({ error: 'Failed to fetch collections' });
    }
  });

  server.all(/.*/, (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
