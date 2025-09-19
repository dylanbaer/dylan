import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

// CORS (GET/POST/OPTIONS from ChatGPT)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'https://chat.openai.com') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'false');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json()); // so POST bodies parse

// SSE stream
app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const send = (d) => res.write(`data: ${JSON.stringify(d)}\n\n`);

  // minimal “hello” the client can read
  send({ type: 'ready', ts: new Date().toISOString() });

  const hb = setInterval(() => { res.write(':\n\n'); send({ type: 'tick', ts: new Date().toISOString() }); }, 5000);
  req.on('close', () => clearInterval(hb));
});

// Accept POSTs (many MCP clients ping or send messages here)
app.post('/messages', (req, res) => {
  // For now just ACK whatever was sent
  res.status(200).json({ ok: true });
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
