'use strict';

const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3001;

const client = require('./lib/client');

// import ejs library, invoke ejs, look through views folder
require('ejs');
app.set('view engine', 'ejs');

// public is front end
app.use(express.static('./public'));
// parses body
app.use(express.urlencoded());

// js libraries
const searchResults = require('./lib/searchresults/searchresults');
const getBooksDatabaseRenderIndex = require('./lib/renderindex');
const getForm = require('./lib/getform');

let viewDetails = (request, response) => {
  console.log(request);
  response.render('pages/books/show', { request: request, });
};

// routes
app.get('/', getBooksDatabaseRenderIndex); // home
app.get('/new', getForm); // pages/searches/new
app.post('/searches', searchResults); // pages/searches/show
app.get('/books/:isbn', viewDetails); // pages/books/show

app.use('*', (request, response) => {
  response.render('pages/error'); // 404 not found route
});

// if connected to database, start server
client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`listening on ${PORT}`));
  })
  .catch(error => console.error(error));
