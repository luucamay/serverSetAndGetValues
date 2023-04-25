const http = require('http');
const { URL } = require('url');
/* Disclaimer:
// as it uses the value in its own memory the server modifies that in its own file not in this test file */
const server = require('./server.js');

const memory = {};

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
