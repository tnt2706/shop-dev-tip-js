const orderService = require('../services/checkout.service')
const {  SuccessResponse } = require('../core/success.response')

class OrderController {
  orderByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Order success !",
      metadata: await orderService.orderByUser(req.body)
    }).send(res)
  };
}

module.exports = new OrderController();
