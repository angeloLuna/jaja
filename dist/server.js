var express = require('express'),
  path = require('path'),
  app = express();

// Set the public folders to serve public assets
app.use('/scripts', express.static('dist/scripts'));
app.use('/styles', express.static('dist/styles'));
app.use('/images', express.static('dist/images'));

// Catch default route
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
});

module.exports = app;

app.listen(8080);