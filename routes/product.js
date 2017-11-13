var express = require("express"),
  bodyParser = require("body-parser"),
  session = require("express-session"),
  mongoose = require("mongoose");

var router = express.Router();
var Product = mongoose.model("Product");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({
    error: [{ userMessage: message, internalMessage: reason, code: code }]
  });
}

//Create product
router.post("/", function(req, res, next) {
  var newProduct = Product(req.body);
  var errMes = "";
  newProduct.save(function(err, doc) {
    if (err) {
      handleError(res, err.message, "Product Creation was Unsuccesfull", 400);
    } else {
      var allowedOrigins = ['http://127.0.0.1:4200', 'http://localhost:4200'];
      var origin = req.headers.origin;
      if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
      //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
      res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.header('Access-Control-Allow-Credentials', true);
      res.status(201).json({status:201, data: doc, message: "Successfully Created Product"});
    }
  });
});

// Get a list of product
router.get("/", function(req, res) {
  var cart = req.session.cart,
    total = 0;
  for (var item in cart) {
    total += cart[item].qty;
  }
  Product.find({}, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get a list of product.", 404);
    } else {
      res.status(200).json({status: 200, datas: {data: docs, total: total}, message: "Succesfully Product Recieved"});
    }
  });
  var item = {};
});

//Get a product by name
router.get("/:name", function(req, res) {
  var cart = req.session.cart,
    total = 0;
  for (var item in cart) {
    total += cart[item].qty;
  }
  Product.find({ name: req.params.name }, function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get a product.", 404);
    } else {
      if (docs.length == 0) {
        Product.find({ $text: { $search: req.params.name } }, function(
          err,
          docs
        ) {
          if (err) {
            handleError(res, err.message, "Failed to get a product.", 404);
          } else {
            res.status(200).json({status: 200, data: docs, message: "Succesfully Product Recieved"});
          }
        });
      } else {
        res.status(200).json({status: 200, data: docs, message: "Succesfully Product Recieved"});
      }
    }
  });

  var item = {};
});

//Delete a product
router.delete("/:id", function(req, res) {
  Product.findOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function(
    err,
    model
  ) {
    if (err) {
      handleError(res, err.message, "Failed to delete product.");
    }
    if (model) {
      model.remove(function(err) {
        if (err) {
          handleError(res, err.message, "Failed to delete a product.", 409);
        } else {
          res.status(200).json({status:204, message: "Succesfully Todo Deleted"});
        }
      });
    }
  });
});

module.exports = router;
