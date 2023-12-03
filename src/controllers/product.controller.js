const productService = require('../services/product.service')
const {  SuccessResponse } = require('../core/success.response')

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Registered OK !",
      metadata: await productService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId
      })
    }).send(res)
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product success !",
      metadata: await productService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id
      })
    }).send(res)
  };


  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Un-publish product success !",
      metadata: await productService.unpublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.prams.id
      })
    }).send(res)
  };


  // QUERY///

  findAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get findAllDraftsForShop success !",
      metadata: await productService.findAllDraftsForShop( {
        product_shop: req.user.userId
      })
    }).send(res)
  };

  findAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get findAllPublishForShop success !",
      metadata: await productService.findAllPublishForShop( {
        product_shop: req.user.userId
      })
    }).send(res)
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get getListSearchProduct success !",
      metadata: await productService.getListSearchProduct(req.params)
    }).send(res)
  };
}

module.exports = new ProductController();
