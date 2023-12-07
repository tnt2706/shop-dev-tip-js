const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const { authentication } = require('../../auth/checkAuth');
const inventoryController = require('../../controllers/inventory.controller');

const router = express.Router();

router.use(authentication);
router.post('', asyncHandel(inventoryController.addStock));

module.exports = router;
