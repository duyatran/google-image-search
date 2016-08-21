var express = require('express');
var path = require('path');
var db = require('./db');
var https = require('https');
var url = require('url', true);
var config = require('./config');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));        

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/api/imagesearch/:keyword(*)', function(req, response) {
  var timestamp = new Date();
  var temp = Number(req.query.offset);
  var q = {
    key: config.API_KEY,
    cx: config.API_CX,
    keyword: req.params.keyword,
    start: temp !== temp ? 1 : 1 + temp
  };
    
  db.insertQuery(q.keyword, timestamp, function(err, output){
    if (err) throw err;
  });
  
  var searchAPI = `https://www.googleapis.com/customsearch/v1?key=${q.key}&cx=${q.cx}&searchType=image&fields=items(link, snippet, image/thumbnailLink, image/contextLink)&q=${q.keyword}&start=${q.start}`;
  
  https.get(searchAPI, (res) => {
    var buffer = [];
    res.on('data', (d) => {
      buffer.push(d);
    }).on('end', function() {
      var body = JSON.parse(Buffer.concat(buffer));
      var output = [];
      var anImage;
      body.items.forEach(function(result) {
          anImage = {};
          anImage.url = result.link;
          anImage.snippet = result.snippet;
          anImage.thumbnail = result.image.thumpnailLink;
          anImage.context = result.image.contextLink;
          output.push(anImage);
      });
      response.json(output);
    });

  }).on('error', (e) => {
    console.error(e);
  });

  
});

app.get('/api/latest/imagesearch', function(req, res) {
  db.getLatest(function(err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(process.env.PORT || 3000);
