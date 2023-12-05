const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const orderController = require('../../controllers/product.controller');

const router = express.Router();

router.post('/checkout', asyncHandel(orderController.checkout));
=
module.exports = router;
