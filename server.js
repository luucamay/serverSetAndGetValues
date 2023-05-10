const http = require('http');
const fs = require('fs');
const { URL } = require('url');

const memory = {};

const server = http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === '/set' && searchParams) {
    for (const [key, value] of searchParams) {

      fs.writeFile('db_test.txt', key + '=' + value + '\n', { flag: 'a+' }, err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });

      memory[key] = value;
    }
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Value set successfully!');
  } else if (pathname === '/get' && searchParams && searchParams.has('key')) {
    const keyToFind = searchParams.get('key');
    const value = memory[keyToFind];
    if (value) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(value);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Value not found');
    }
  } else {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Invalid request');
  }
});

server.listen(4000, 'localhost', () => {
  console.log(`Server running at http://localhost:4000/`);
});

module.exports = server;
