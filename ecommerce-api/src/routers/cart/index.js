const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const cartController = require('../../controllers/cart.controller');

const router = express.Router();

router.post('', asyncHandel(cartController.addToCart));
router.post('/update', asyncHandel(cartController.update));
router.delete('', asyncHandel(cartController.delete));

router.get('', asyncHandel(cartController.listToCart));

module.exports = router;
