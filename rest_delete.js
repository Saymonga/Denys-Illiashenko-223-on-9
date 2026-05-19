const http = require('http');
const fs = require('fs');

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {

  if (req.method === 'DELETE' && req.url.startsWith('/items/')) {

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

      let items = JSON.parse(data);

      const itemExists = items.some(item => item.id == id);

      if (!itemExists) {

        res.writeHead(404, {
          'Content-Type': 'application/json'
        });

        return res.end(JSON.stringify({
          error: 'Item not found'
        }));

      }

      items = items.filter(item => item.id != id);

      fs.writeFile(
        './data.json',
        JSON.stringify(items, null, 2),
        err => {

          if (err) {
            res.writeHead(500, {
              'Content-Type': 'application/json'
            });

            return res.end(JSON.stringify({
              error: 'Cannot write file'
            }));
          }

          res.writeHead(200, {
            'Content-Type': 'application/json'
          });

          res.end(JSON.stringify({
            message: 'Item deleted'
          }));

        }
      );

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