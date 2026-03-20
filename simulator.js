// scripts/listen.js
// 1. Stop npm run dev first
// 2. Run this with: node scripts/listen.js
// 3. Power on ESP32 and watch this terminal

const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {
  const timestamp = new Date().toLocaleTimeString();

  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      console.log('\n=============================');
      console.log(`[${timestamp}] POST received`);
      console.log('URL     :', req.url);
      console.log('Headers :', JSON.stringify(req.headers, null, 2));
      console.log('Body    :', body);

      // try to parse as JSON and pretty print
      try {
        const parsed = JSON.parse(body);
        console.log('Parsed  :', JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log('(body is not valid JSON)');
      }

      console.log('=============================\n');

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });

  } else if (req.method === 'GET') {
    console.log(`\n[${timestamp}] GET request on ${req.url}`);
    res.writeHead(200);
    res.end('Listener is running. Waiting for ESP32 POST...');

  } else {
    res.writeHead(405);
    res.end('Method not allowed');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\nListener started on port ${PORT}`);
  console.log('Waiting for ESP32 to post...');
  console.log('Press Ctrl+C to stop\n');
});