const discountService = require('../services/discount.service')
const {  SuccessResponse } = require('../core/success.response')

class DiscountController {
  createDiscount = async (req, res, next) => {
    new SuccessResponse({
      message: "Create discount code success !",
      metadata: await discountService.createDiscount({...req.body, shopId: req.user.userId })
    }).send(res)
  };


  // QUERY///

  getAllDiscountWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "getAllDiscountWithProduct success !",
      metadata: await discountService.getAllDiscountWithProduct(req.query)
    }).send(res)
  };

  getAllDiscountByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "getAllDiscountByShop success !",
      metadata: await discountService.getAllDiscountByShop({...req.query, shopId:req.user.userId})
    }).send(res)
  };


  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "getDiscountAmount success !",
      metadata: await discountService.getDiscountAmount(req.body)
    }).send(res)
  };

}

module.exports = new DiscountController();
