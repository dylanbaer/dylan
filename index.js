import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);
  send({ status: 'connected', ts: new Date().toISOString() });

  const interval = setInterval(() => {
    res.write(':\n\n');
    send({ ts: new Date().toISOString() });
  }, 5000);

  req.on('close', () => clearInterval(interval));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
