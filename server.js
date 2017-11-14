var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());
app.use(session({
        secret : "hgfjh",
        saveUninitialized: true,
        resave: false
    }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
var cors = require('./cors');
app.use(cors.permission);
var db = require('./models/db'),
    dbProducts = require('./models/products');
    
var routesProduct = require('./routes/product'),
    routesCart = require('./routes/cart');

const port = 3000;



app.use('/products', routesProduct);
app.use('/carts', routesCart);

app.listen(port, () => {
console.log('Listen on port: ' + port)
});

module.exports = app;

