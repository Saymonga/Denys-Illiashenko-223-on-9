const http = require('http');
const fs = require('fs');

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {

  if (req.method === 'PUT' && req.url.startsWith('/items/')) {

    const id = req.url.split('/')[2];

    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {

      try {

        const updates = JSON.parse(body);

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

          const index = items.findIndex(item => item.id == id);

          if (index === -1) {

            res.writeHead(404, {
              'Content-Type': 'application/json'
            });

            return res.end(JSON.stringify({
              error: 'Item not found'
            }));

          }

          items[index] = {
            ...items[index],
            ...updates
          };

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

              // Success
              res.writeHead(200, {
                'Content-Type': 'application/json'
              });

              res.end(JSON.stringify(items[index]));

            }
          );

        });

      } catch {

        res.writeHead(400, {
          'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
          error: 'Invalid JSON'
        }));

      }

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