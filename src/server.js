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

app.post('/login', (request, response) => {
  console.log(request.body);
  const postData = query.stringify({
    username: `${request.body.username}`,
    password: `${request.body.pass}`
  });

  console.log(postData);

  const postOptions = {
    host: 'backend',
    port: '80',
    path: '/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  request.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  response.on('data', (chunk) => {
    console.log('Response: ', chunk);
  });

  request.write(postData);
  request.end();
});

app.listen(port, (err) => {
  if(err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});