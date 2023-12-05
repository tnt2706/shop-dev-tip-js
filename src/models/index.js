const Shop = require('./shop.model');
const KeyToken = require('./keyToken.model');
const ApiKey = require('./apiKey.model');
const Inventory = require('./inventory.model');
const Discount = require('./discount.model');
const Cart = require('./cart.model');

const productModel = require('./product.model');

module.exports = {
  Shop,
  KeyToken,
  ApiKey,
  Inventory,
  Discount,
  Cart,
  ...productModel,
};
