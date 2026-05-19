const http = require('http');
const fs = require('fs');

const PORT = process.argv[2] || 3000;

const server = http.createServer((req, res) => {

  if (req.method === 'POST' && req.url === '/items') {

    let body = '';

    // Receive body chunks
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {

      try {

        const newItem = JSON.parse(body);

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

          items.push(newItem);

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
              res.writeHead(201, {
                'Content-Type': 'application/json'
              });

              res.end(JSON.stringify(newItem));

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