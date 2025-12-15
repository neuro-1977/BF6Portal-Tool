const fetch = require('node-fetch');
import express from 'express';
import { createBlockSVG } from './svg-renderer';
import * as path from 'path';

const app = express();
const port = 3000;

console.log('STARTING SERVER: This is blockly-workspace/src/server.ts, build time:', new Date().toISOString());

// --- Debug: List all registered routes ---
app.get('/api/routes', (req, res) => {
  const routes: string[] = [];
  (app as any)._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      routes.push(middleware.route.path);
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          routes.push(handler.route.path);
        }
      });
    }
  });
  res.json({ routes });
});

// --- Debug: Simple test endpoint ---
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint is working.' });
});


// Serve static files from blockly-workspace root
app.use(express.static(path.join(__dirname, '../')));


// Serve index.html for root and any unknown route (SPA fallback)
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});