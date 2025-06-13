const express = require('express');
const next = require('next');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Define your Express routes here
  server.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express inside Next.js!' });
    console.log('Sample route for /api/hello called!');
  });

  // Default catch-all handler to let Next.js handle all other routes
  server.all(/(.*)/, (req, res) => {
  return handle(req, res);
  });



  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
