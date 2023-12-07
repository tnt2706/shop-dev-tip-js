const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const { authentication } = require('../../auth/checkAuth');
const commentController = require('../../controllers/comment.controller');

const router = express.Router();

router.use(authentication);
router.post('', asyncHandel(commentController.addComment));

module.exports = router;
