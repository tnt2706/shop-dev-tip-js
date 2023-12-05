const cartService = require('../services/cart.service')
const {  SuccessResponse } = require('../core/success.response')

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Create discount code success !",
      metadata: await cartService.addToCart({...req.body, shopId: req.user.userId })
    }).send(res)
  };


  // QUERY///

}

module.exports = new CartController();
