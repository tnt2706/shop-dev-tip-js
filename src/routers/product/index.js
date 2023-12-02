const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const { authentication } = require('../../auth/checkAuth');
const productController = require('../../controllers/product.controller');

const router = express.Router();

router.use(authentication);

router.post('', asyncHandel(productController.createProduct));

module.exports = router;
