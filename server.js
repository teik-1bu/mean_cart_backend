var express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  cookieParser = require('cookie-parser'),
  mongoose = require('mongoose');
var MemoryStore = require('session-memory-store')(session);
var MongoStore = require('connect-mongo')(session);
var app = express();
app.use(cookieParser());
app.use(
  session({
    key: 'A_SESSION_KEY',
    secret: 'SOMETHING_REALLY_HARD_TO_GUESS',
    // store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30 * 12 //one year(ish)
    }
  })
);
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
//var cors = require('./cors');
//app.use(cors.permission);
var db = require('./models/db'),
  dbProducts = require('./models/products');

var routesProduct = require('./routes/product'),
  routesCart = require('./routes/cart');

const port = 3000;

app.use('/products', routesProduct);
app.use('/carts', routesCart);

app.listen(port, () => {
  console.log('Listen on port: ' + port);
});

module.exports = app;
