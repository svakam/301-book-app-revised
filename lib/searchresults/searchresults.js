'use strict';

const addHttps = require('./addhttps');
const superagent = require('superagent');

let searchResults = (request, response) => {
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
};

// constructor
function Book(bookObj) {
  this.title = bookObj.title || 'no title available';
  if (bookObj.authors) {
    this.author = bookObj.authors[0] || 'no author available';
  }
  this.summary = bookObj.description || '(no description available)';
  if (bookObj.imageLinks) {
    // eslint-disable-next-line camelcase
    this.image_url = addHttps(bookObj.imageLinks.thumbnail) || '(no image available)';
  }
}

module.exports = searchResults;
