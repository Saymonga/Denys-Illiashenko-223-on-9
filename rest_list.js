const http = require('http');
const fs = require('fs');

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {

  if (req.method === 'GET' && req.url === '/items') {

    fs.readFile('./data.json', 'utf8', (err, data) => {

      if (err) {
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });

        return res.end(JSON.stringify({
          error: 'Cannot read file'
        }));
      }

      res.writeHead(200, {
        'Content-Type': 'application/json'
      });

      res.end(data);
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