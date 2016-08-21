var pg = require('pg');
var config = require('./config');
var connectionString = process.env.DATABASE_URL || config.DB_URL;
var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE search_terms(id SERIAL PRIMARY KEY, term VARCHAR(200) not null, time timestamptz not null);');
query.on('end', function() { client.end(); });
