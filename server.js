'use strict';

// import express library
const express = require('express');
// invoke express
const app = express();
// public is front end
app.use(express.static('./public'));

// parses body
app.use(express.urlencoded());

// import superagent library
const superagent = require('superagent');

// import and configure .env library
require('dotenv').config();

// set port
const PORT = process.env.PORT || 3001;

// import pg library and connect to postgres URL
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', error => {
  console.log('database error');
  throw error;
});

// import ejs library
require('ejs');
// invoke ejs, look through views folder
app.set('view engine', 'ejs');

let getBooksDatabaseRenderIndex = (request, response) => {
  // retrieve books from database:
  // sql command to select all books
  let sql = 'SELECT * FROM booksrevised';

  // query the database
  client.query(sql)
    .then(results => {
      response.render('/pages/index', { results: results.rows, });
    })
    .catch(error => {
      console.error(error);
    });
};

let getForm = (request, response) => {
  response.render('pages/searches/new');
};

function searchResults(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';
  let typeOfSearch = request.body.search[1];
  let searchQuery = request.body.search[0];
  if (typeOfSearch === 'title') {
    url += `+intitle:${searchQuery}`;
  }
  if (typeOfSearch === 'author') {
    url += `+inauthor:${searchQuery}`;
  }

  superagent.get(url)
    .then(results => {
      if (results.body.items) {
        let bookArr = results.body.items.map((object) => {
          return new Book(object.volumeInfo);
        });
        response.render('pages/searches/show', { bookArray: bookArr, });
      }
      else {
        response.render('pages/error');
      }
    })
    .catch(error => console.error(error));
}

// add https:// to links if not already https://
let addHttps = (string) => {
  let domain = string.substr(0, 5);
  let prefix = 'https';

  if (string.substr(0, prefix.length) !== prefix) {
    string = string.substr(4, string.length);
    string = prefix + string;
  }
  return string;
};

// constructor
function Book(bookObj) {
  this.title = bookObj.title || 'no title available';
  if (bookObj.authors) {
    this.author = bookObj.authors[0] || 'no author available';
  }
  this.summary = bookObj.description || '(no description available)';
  if (bookObj.imageLinks) {
    this.image_url = addHttps(bookObj.imageLinks.thumbnail) || '(no image available)';
  }
}

// routes
app.get('/', getBooksDatabaseRenderIndex); // home
app.get('/new', getForm); // searches/new
app.post('/searches', searchResults); // searches/show

// if connected to database, start server
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
  })
  .catch(error => console.error(error));
