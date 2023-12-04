const Shop = require('./shop.model');
const KeyToken = require('./keyToken.model');
const ApiKey = require('./apiKey.model');
const Inventory = require('./inventory.model');
const productModel = require('./product.model');

module.exports = {
  Shop,
  KeyToken,
  ApiKey,
  Inventory,
  ...productModel,
};
