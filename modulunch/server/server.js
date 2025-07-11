const express = require('express');
const next = require('next');
const mongoose = require('mongoose');

// IMPORT ROUTES HERE
const apiRoutes = require('./routes/api');
const debugRoutes = require('./routes/debug');

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
    server.use(express.json());

    // ATTACH CUSTOM ROUTES HERE
    server.use('/api', apiRoutes);
    server.use('/debug', debugRoutes);

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
