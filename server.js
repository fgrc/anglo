// server.js

// set up ========================
const express = require('express');
const morgan = require('morgan'); // log requests to the console (express4)
const bodyParser = require('body-parser'); // pull information from HTML POST (express4)
const methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
const path = require('path');
const http = require('http');


// configuration =================

var app = express(); // create our app w/ express
app.use(express.static("myAp")); // myApp will be the same folder name.
app.get("/", function (req, res,next) {
 res.redirect("/"); 
});
app.listen(8081, "localhost");
console.log("MyProject Server is Listening on port 8080");

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));