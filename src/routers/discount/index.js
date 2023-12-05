const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const { authentication } = require('../../auth/checkAuth');
const discountController = require('../../controllers/discount.controller');

const router = express.Router();

router.get('/list_product_code', asyncHandel(discountController.getAllDiscountWithProduct));
router.post('/amount', asyncHandel(discountController.getDiscountAmount));

// authentication //
router.use(authentication);

router.get('', asyncHandel(discountController.getAllDiscountByShop));
router.post('', asyncHandel(discountController.createDiscount));

module.exports = router;
