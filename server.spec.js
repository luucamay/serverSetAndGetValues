const http = require('http');
const { URL } = require('url');

const memory = {};

const server = http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url, `http://${req.headers.host}`);

  if (pathname === '/set' && searchParams) {
    for (const [key, value] of searchParams) {
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

beforeAll(() => {
  server.listen(4000, 'localhost');
});

afterAll(() => {
  server.close();
});

describe('Server tests', () => {

  test('sets and retrieves value from memory', (done) => {
    const setUrl = 'http://localhost:4000/set?somekey=somevalue';
    const getUrl = 'http://localhost:4000/get?key=somekey';

    const requestToSet = http.request(setUrl, (res) => {
      expect(res.statusCode).toBe(200);
      expect(memory).toHaveProperty('somekey', 'somevalue');
      done();
    });
    requestToSet.end();

    const requestToGet = http.request(getUrl, (res) => {
      expect(res.statusCode).toBe(200);
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        expect(data).toBe('somevalue');
        done();
      });
    });
    requestToGet.end();
  });

  test('handles missing value', (done) => {
    const url = 'http://localhost:4000/get?key=nonexistent';
    const req = http.request(url, (res) => {
      expect(res.statusCode).toBe(404);
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        expect(data).toBe('Value not found');
        done();
      });
    });
    req.end();
  });

  test('handles invalid request', (done) => {
    const url = 'http://localhost:4000/invalid';
    const req = http.request(url, (res) => {
      expect(res.statusCode).toBe(400);
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        expect(data).toBe('Invalid request');
        done();
      });
    });
    req.end();
  });
});
