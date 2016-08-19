var pg = require('pg');
var DATABASE_URL = process.env.DATABASE_URL || 'postgres://postgres:dollar112@localhost:5432/freecodecamp';

function query(sql, params, cb) {
  pg.defaults.ssl = true;
  pg.connect(DATABASE_URL, function(err, client, done) {
    if (err) {
      done();
      cb(err);
      return;
    }
    client.query(sql, params, cb);
    });
}

exports.insert = function(long_url, cb) {
  var sql = 'INSERT INTO urls(url) VALUES($1) RETURNING id';
  query(sql, [long_url], function(err, result) {
    if (err) return cb(err);  
    cb(null, result.rows[0].id);
  });
};

exports.getURL = function(shortcut, cb) {
  console.log(shortcut + " " + typeof(shortcut));
  var sql = 'SELECT url FROM urls WHERE id = $1';
  query(sql, [shortcut], function(err, result) {
    if (err) return cb(err);
    cb(null, result.rows);
  });
};

