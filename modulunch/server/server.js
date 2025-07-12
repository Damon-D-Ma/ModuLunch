const express = require('express');
const next = require('next');
const mongoose = require('mongoose');

// IMPORT ROUTES HERE
const apiRoutes = require('./routes/api');
const debugRoutes = require('./routes/debug');
const adminRoutes = require('./routes/admin');


const connectDB = require('./db');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();


// For authentication
const session = require('express-session');
const MongoStore = require('connect-mongo');


(async () => {
  try {
    // Await DB connection before starting server
    await connectDB();

    // Prepare Next.js
    await app.prepare();

    const server = express();
    server.use(express.json());

    // TODO: ALLOW HTTPS LATER
    server.use(session({
      secret: process.env.SESSION_SECRET || 'default_dev_secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: !dev, // Only true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 2 // 2 hours
      },
      store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 60 * 60 * 2 // session expiration in seconds
      })
    }));

    // ATTACH CUSTOM ROUTES HERE
    server.use('/api', apiRoutes);
    server.use('/debug', debugRoutes);
    server.use('/admin', adminRoutes);

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
