const http = require('http');
const url = require('url');
const query = require('querystring');
const fs = require('fs');
const express = require('express');

const main = require('./main.js');
const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const js = fs.readFileSync(`${__dirname}/../client/client.js`);

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();

app.get('/', (request, response) =>{
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
});

app.get('/client.js', (request, response) =>{
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(js);
  response.end();
});
// app.get('/login', main.login);

app.listen(port, (err) => {
  if(err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});