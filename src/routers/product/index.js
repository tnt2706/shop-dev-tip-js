const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const { authentication } = require('../../auth/checkAuth');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router.get('/search/:keySearch', asyncHandel(productController.getListSearchProduct));

// authentication //
router.use(authentication);

router.post('', asyncHandel(productController.createProduct));
router.post('/publish/:id', asyncHandel(productController.publishProductByShop));
router.post('/unpublish/:id', asyncHandel(productController.unpublishProductByShop));

router.get('/drafts/all', asyncHandel(productController.findAllDraftsForShop));
router.get('/publish/all', asyncHandel(productController.findAllPublishForShop));

module.exports = router;
