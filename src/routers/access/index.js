const express = require("express");

const { asyncHandel } = require("../../auth/checkAuth");
const accessController = require("../../controllers/access.controller");

const router = express.Router();

router.post("/shop/signup", asyncHandel(accessController.signUp));
router.post("/shop/login", asyncHandel(accessController.login));

module.exports = router;
