const cartService = require('../services/cart.service')
const {  SuccessResponse } = require('../core/success.response')

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "addToCart success !",
      metadata: await cartService.addToCart(req.body)
    }).send(res)
  };

  update = async (req, res, next) => {
    new SuccessResponse({
      message: "update cart success !",
      metadata: await cartService.updateUserCart(req.body)
    }).send(res)
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "delete cart success !",
      metadata: await cartService.deleteUserCart(req.body)
    }).send(res)
  };

  // QUERY///

  listToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list cart success !",
      metadata: await cartService.listUserCart(req.query)
    }).send(res)
  };

}

module.exports = new CartController();
