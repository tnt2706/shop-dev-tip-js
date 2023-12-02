const Shop = require('./shop.model');
const KeyToken = require('./keyToken.model');
const ApiKey = require('./apiKey.model');
const productModel = require('./product.model');

module.exports = {
  Shop,
  KeyToken,
  ApiKey,
  ...productModel,
};
