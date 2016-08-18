var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:dollar112@localhost:5432/freecodecamp';
console.log("just curious: " + process.env.DATABASE_URL);
var client = new pg.Client(connectionString);
client.connect();
var query = client.query('CREATE TABLE urls (id SERIAL PRIMARY KEY, url VARCHAR(2000) not null)');
query.on('end', function() { client.end(); });
