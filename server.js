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

// import pg library
const pg = require('pg');

// import ejs library
require('ejs');
// invoke ejs, look through views folder
app.set('view engine', 'ejs');

// routes


// start server
app.listen(PORT, () => console.log(`listening on ${PORT}`));
