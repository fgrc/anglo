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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});


const port = process.env.PORT || '8090';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
// server.listen(port, () => console.log(`API running on localhost:${port}`));