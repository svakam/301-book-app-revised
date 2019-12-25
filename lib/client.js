'use strict';

// import pg library and connect to postgres URL
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => {
  console.log('database error');
  throw error;
});

module.exports = client;
