const productService = require('../services/product.service')
const {  SuccessResponse } = require('../core/success.response')

class ProductController {
  createProduct = async (req, res, next) => {
    console.log({req,res})
    new SuccessResponse({
      message: "Registered OK !",
      metadata: await productService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  };

}

module.exports = new ProductController();
