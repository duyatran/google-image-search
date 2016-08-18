var express = require('express');
var app = express();
var path = require('path');
var db = require('./db');

app.use(express.static(path.join(__dirname, 'public')));        
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.get(/new\/(.+)/, function(req, res) {
  var long_url = req.params[0];
  console.log(long_url);
  db.insert(long_url, function(err, current_ID){
    if (err) throw err;

    var short_url = req.protocol + '://' + req.get('host') + '/' +  encode(current_ID).toString(); 
    var output = {"original_url" : long_url, "short_url": short_url};
    res.json(output);
  });
});

app.get('/:shortcut', function(req, res) {
  console.log(req.params.shortcut);
  var index = decode(req.params.shortcut);
  console.log("index is " + index);
  db.getURL(index, function(err, result) {
    if (err) throw err;
    console.log(result);
    res.redirect(302, result);
  });
});

app.listen(process.env.PORT || 3000);

//HELPERS

var alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var base = alphabet.length;
function encode(num) {
  var temp = '';
  var result = [];
  while (num > 0) {
    remainder = num % base;
    temp = alphabet[remainder];
    result.push(temp);
    num  = Math.floor(num / base);
  }
  return result.reverse().join();
}

function decode(num) {
  var result = 0;
  for (var i = 0; i < num.length; i++) {
    result = result * base + alphabet.indexOf(num[i]);
  }
  return result;
}
