const checkoutService = require('../services/checkout.service')
const { SuccessResponse } = require('../core/success.response')

class CartController {
  checkoutReview = async (req, res, next) => {
    const metadata = await checkoutService.checkoutReview(req.body)
    console.log(metadata)
    new SuccessResponse({
      message: "Check out review success !",
      metadata
    }).send(res)
  };
}

module.exports = new CartController();
