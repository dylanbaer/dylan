import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

// CORS for ChatGPT UI
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');               // or 'https://chat.openai.com'
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  send({ status: 'connected', ts: new Date().toISOString() });

  const interval = setInterval(() => {
    res.write(':\n\n');                // heartbeat comment
    send({ ts: new Date().toISOString() });
  }, 5000);

  req.on('close', () => clearInterval(interval));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
