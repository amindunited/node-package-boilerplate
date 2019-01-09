const express = require('express');
// const bodyParser = require('body-parser');
const setup = require('./setup.js');
const readFile = require('@amindunited/utils').fileSystem.readFile;
const app = express();
const port = 3000;
let server;

/**
 * This could use the static server
 */
app.get('/', async (req, res) => {
  const fileContents = await readFile('./index.html');
  res.type('text/html; charset=utf-8');
  res.send(fileContents);
});

app.use(express.urlencoded());
app.post('/', async (req, res) => {
  setup(req.body);
  console.log('submitted form ', req.body);
});

const startServer = () => {
  // Close the server if it is running
  if (server && server.close && app.address()) {
    server.close();
  }
  server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    console.log('http://localhost:3000');
  });
};
startServer();
