const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const { authentication } = require('../../auth/checkAuth');
const accessController = require('../../controllers/access.controller');

const router = express.Router();

router.post('/shop/signup', asyncHandel(accessController.signUp));
router.post('/shop/login', asyncHandel(accessController.login));

router.use(authentication);

router.post('/shop/logout', asyncHandel(accessController.logout));
router.post('/shop/handlerRefreshToken', asyncHandel(accessController.handlerRefresherToken));

module.exports = router;
