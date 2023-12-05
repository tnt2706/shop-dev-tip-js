const orderService = require('../services/order.service')
const {  SuccessResponse } = require('../core/success.response')

class CartController {
  checkoutOrder = async (req, res, next) => {
    new SuccessResponse({
      message: "Check out order success !",
      metadata: await orderService.checkoutOrder(req.body)
    }).send(res)
  };
}

module.exports = new CartController();
