var pg = require('pg');
var config = require('./config');
var DATABASE_URL = process.env.DATABASE_URL || config.DB_URL; 

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

function insertQuery(keyword, timestamp, cb) {
  var sql = 'INSERT INTO search_terms(term, time) VALUES($1, $2)';
  query(sql, [keyword, timestamp], function(err, result) {
    if (err) return cb(err);  
    cb(null, result);
  });
}

function getLatest(cb) {
  var sql = 'SELECT term, time FROM search_terms ORDER BY time DESC LIMIT 10';
  query(sql, [], function(err, result) {
    if (err) return cb(err);
    cb(null, result.rows);
  });
}

exports.insertQuery = insertQuery;
exports.getLatest = getLatest;
