const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const checkoutController = require('../../controllers/checkout.controller');

const router = express.Router();

router.post('/review', asyncHandel(checkoutController.checkoutReview));

module.exports = router;
