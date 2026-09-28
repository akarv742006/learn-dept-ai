import http from 'http';
import dotenv from 'dotenv';
import { handleApiRequest } from './server/apiRouter.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

const server = http.createServer(async (req, res) => {
  if (req.url && req.url.startsWith('/api/ai')) {
    let body = {};
    if (req.method === 'POST' || req.method === 'PUT') {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const text = Buffer.concat(buffers).toString();
      try {
        body = JSON.parse(text);
      } catch (e) {
        body = {};
      }
    }
    await handleApiRequest(req, res, req.url, body);
    return;
  }

  res.statusCode = 404;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`[LearnDebt AI Server] Server listening on http://localhost:${PORT}`);
});
