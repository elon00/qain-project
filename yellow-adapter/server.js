// server.mjs
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8787;

// Health check endpoint
app.get('/yellow/ping', (req, res) => {
  res.json({ ok: true, service: 'yellow-adapter', ts: Date.now() });
});

app.listen(PORT, () => {
  console.log(`yellow-adapter running at http://localhost:${PORT}`);
});