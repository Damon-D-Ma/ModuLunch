const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const User = require('./models/User'); // adjust the path as needed
const connectDB = require('./db');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

(async () => {
  try {
    // Await DB connection before starting server
    await connectDB();

    // Prepare Next.js
    await app.prepare();

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

    server.get('/api/3ddc3ee497ddc1db', async (req, res) => {
      try {
        const adminUser = await User.findOne({ isAdmin: true });

        if (adminUser) {
          const adminInfo = adminUser.toObject();
          delete adminInfo.pw;
          res.json({
            success: true,
            message: 'Admin user info:',
            admin: adminInfo,
          });
        } else {
          res.json({
            success: false,
            message: 'ERROR: Could not find admin user',
          });
        }
      } catch (err) {
        console.error('Error in debug admin route:', err);
        res.status(500).json({ error: 'Issue with debug admin route' });
      }
    });

    // For all other requests, let Next.js handle it
    server.all(/.*/, (req, res) => {
      return handle(req, res);
    });

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
  }
})();
