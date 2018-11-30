const http = require('http');
const url = require('url');
const query = require('querystring');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const getJSON = require('get-json');

const main = require('./main.js');
const index = fs.readFileSync(`${__dirname}/../client/index.html`);
const js = fs.readFileSync(`${__dirname}/../client/client.js`);
const css = fs.readFileSync(`${__dirname}/../client/styles.css`);
const facultyLogo = fs.readFileSync(`${__dirname}/../client/facultylogo.png`);
const userLogo = fs.readFileSync(`${__dirname}/../client/userlogo.png`);

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

app.get('/styles.css', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
});

app.get('/facultylogo.png', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(facultyLogo);
  response.end();
});

app.get('/userlogo.png', (request, response) => {
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.write(userLogo);
  response.end();
});

// app.post('/login', (request, response) => {
//   const req = request;
//   const res = response;
//   console.log(req.body);
  
//   const postData = query.stringify({
//     username: `${req.body.username}`,
//     password: `${req.body.pass}`
//   });

//   console.log(postData);

//   const postOptions = {
//     host: 'backend',
//     port: '80',
//     path: '/login',
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Content-Length': Buffer.byteLength(postData)
//     }
//   };

//   /**
//    * For get, append 
//    */

//   request.on('error', (err) => {
//     console.dir(err);
//     res.statusCode = 400;
//     res.end();
//   });

//   response.on('data', (chunk) => {
//     console.log('Response: ', chunk);
//   });

//   request.write(postData);
//   request.end();
// });

app.get('/getAllStudents', (request, response) => {
  const url = 'http://serenity.ist.rit.edu/~ra7918/330/research_database/api/user/getAllStudents.php';

  return response.json({
    results: [{"name":"Rix A.", "userId":"1","username":"rix","role":"student","searching":"1","interests":"[\"Math\",\"Science\",\"General\"]","rating":"4","bio":"This is my bio!","gradDate":"05\/24\/2020"},{"name": "Ben T.","userId":"2","username":"ben","role":"student","searching":"0","interests":"[\"Math\"]","rating":"5","bio":"Not my bio","gradDate":"05\/24\/2019"}]
  });
});

app.listen(port, (err) => {
  if(err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});