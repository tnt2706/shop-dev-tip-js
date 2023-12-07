const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const orderController = require('../../controllers/order.controller');

const router = express.Router();

router.post('', asyncHandel(orderController.orderByUser));

module.exports = router;
