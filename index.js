import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

// Precise CORS for ChatGPT
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'https://chat.openai.com') {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'false');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  const send = (d) => res.write(`data: ${JSON.stringify(d)}\n\n`);
  send({ status: 'connected', ts: new Date().toISOString() });
  const hb = setInterval(() => { res.write(':\n\n'); send({ ts: new Date().toISOString() }); }, 5000);
  req.on('close', () => clearInterval(hb));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
