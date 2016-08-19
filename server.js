var express = require('express');
var app = express();
var path = require('path');
var db = require('./db');
var helpers = require('./helpers');

app.use(express.static(path.join(__dirname, 'public')));        
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get(/new\/(.+)/, function(req, res) {
  var long_url = req.params[0];
  console.log(long_url);
  db.insert(long_url, function(err, current_ID){
    if (err) throw err;

    var short_url = req.protocol + '://' + req.get('host') + '/' +  helpers.encode(current_ID).toString(); 
    var output = {"original_url" : long_url, "short_url": short_url};
    res.json(output);
  });
});

app.get('/:shortcut', function(req, res) {
  console.log(req.params.shortcut);
  var index = helpers.decode(req.params.shortcut);
  console.log("index is " + index);
  db.getURL(index, function(err, result) {
    if (err) throw err;
    if (result.length == 0) {
      var error = {error: "There is no such URL, you sure didn't mistype it?"};
      res.json(error);
    }
    else {
    res.redirect(302, result[0].url);
    }
  });
});

app.listen(process.env.PORT || 3000);
