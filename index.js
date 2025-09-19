// Import the Express web framework
import express from 'express';

// Create an Express application instance
const app = express();

// Define an HTTP GET route at /sse
app.get('/sse', (req, res) => {
  // Tell the client this is a Server-Sent Events (SSE) stream
  res.setHeader('Content-Type', 'text/event-stream');
  // Prevent browsers and proxies from caching the response
  res.setHeader('Cache-Control', 'no-cache');
  // Keep the connection open for streaming
  res.setHeader('Connection', 'keep-alive');

  // Helper function to send an event to the client
  const send = (obj) => res.write(`data: ${JSON.stringify(obj)}\n\n`);

  // Send an initial event as soon as the client connects
  send({ status: 'connected', ts: new Date().toISOString() });

  // Every 5 seconds, send a heartbeat and a timestamp
  const heartbeat = setInterval(() => {
    res.write(`: ping\n\n`); // SSE comment (keeps the connection alive)
    send({ ts: new Date().toISOString() });
  }, 5000);

  // If the client disconnects, stop sending heartbeats
  req.on('close', () => clearInterval(heartbeat));
});

// Start the server on port 3000
app.listen(3000);
