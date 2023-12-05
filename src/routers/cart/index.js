const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const { authentication } = require('../../auth/checkAuth');
const cartController = require('../../controllers/cart.controller');

const router = express.Router();

router.post('', asyncHandel(cartController.addToCart));

// authentication //
router.use(authentication);

module.exports = router;
