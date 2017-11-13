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

// Add a product to the cart
router.post("/", function(req, res) {
  req.session.cart = req.session.cart || {};
  var cart = req.session.cart;

  //Read the incoming product data
  var id = req.body.productId;
  if (!cart) {
    cart = {};
  }
  //Locate the product to be added
  Product.findById(id, function(err, prod) {
    if (err) {
      handleError(
        res,
        err.message,
        "Failed to add a products to the cart.",
        400
      );
    }

    //Add or increase the product quantity in the shopping cart.
    if (cart[id]) {
      cart[id].qty++;
    } else {
      cart[id] = {
        id: id,
        name: prod.name,
        price: prod.price,
        qty: 1
      };
    }

    //Display the cart for the user
    res.status(201).json(cart);
  });
});

// Get cart
router.get("/", function(req, res) {
  //Retrieve the shopping cart from memory
  var cart = req.session.cart,
    displayCart = { items: [], total: 0 },
    total = 0;

  if (!cart) {
    handleError(res, "Cart is empty", "Failed to get a cart.", 404);
  }

  //Ready the products for display
  for (var item in cart) {
    displayCart.items.push(cart[item]);
    total += cart[item].qty * cart[item].price;
  }
  req.session.total = displayCart.total = parseFloat(total).toFixed(2);

  var model = { cart: displayCart };
  res.status(200).json(model.cart);
});

//Delete all cart
router.delete("/", function(req, res) {
  req.session.destroy();
  res.redirect("./products/list");
});

//Delete a product form the cart by id
router.delete("/:id", function(req, res) {
  var cart = req.session.cart;

  //Read the incoming product data
  var id = req.params.id;

  if (!cart) {
    handleError(res, "Cart is empty", "Failed to get a cart.", 404);
  } else {
    //Locate the product to be deleted
    Product.findById(id, function(err, prod) {
      if (err || !prod) {
        handleError(res, err, "Product not found!", 404);
      } else {
        //delete or decrease the product quantity in the shopping cart.
        if (cart[id]) {
          if (cart[id].qty > 1) {
            cart[id].qty--;
          } else {
            delete cart[id];
          }
          var i = 0;
          for (var item in cart) {
            i++;
          }
          console.log(i);
          if (i === 0) {
            cart = undefined;
          }
          //Display the cart for the user
          res.status(201).json(cart);
        } else {
          handleError(
            res,
            "Product not exist in the cart",
            "Fail to delete the product from the cart",
            409
          );
        }
      }
    });
  }
});

module.exports = router;
