const http = require('http');
const fs = require('fs');

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {

  if (req.method === 'GET' && req.url.startsWith('/items/')) {

    const id = req.url.split('/')[2];

    fs.readFile('./data.json', 'utf8', (err, data) => {

      if (err) {
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });

        return res.end(JSON.stringify({
          error: 'Cannot read file'
        }));
      }

      const items = JSON.parse(data);

      const item = items.find(i => i.id == id);

      if (!item) {
        res.writeHead(404, {
          'Content-Type': 'application/json'
        });

        return res.end(JSON.stringify({
          error: 'Item not found'
        }));
      }

      res.writeHead(200, {
        'Content-Type': 'application/json'
      });

      res.end(JSON.stringify(item));

    });

    return;
  }

  res.writeHead(404, {
    'Content-Type': 'application/json'
  });

  res.end(JSON.stringify({
    error: 'Not found'
  }));

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});