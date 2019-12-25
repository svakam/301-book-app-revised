'use strict';

const client = require('./client');

let getBooksDatabaseRenderIndex = (request, response) => {
  // retrieve books from database:
  // sql command to select all books
  let sql = 'SELECT * FROM booksrevised';

  // query the database
  client.query(sql)
    .then(results => {
      let count = results.rows.length;
      response.render('pages/index', { database: results.rows, bookCount: count, });
    })
    .catch(error => {
      console.error(error);
    });
};

module.exports = getBooksDatabaseRenderIndex;
