const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const { authentication } = require('../../auth/checkAuth');
const commentController = require('../../controllers/comment.controller');

const router = express.Router();

router.use(authentication);
router.post('', asyncHandel(commentController.addComment));
router.delete('', asyncHandel(commentController.deleteComments));

// GET ///

router.get('', asyncHandel(commentController.getCommentsByParentId));

module.exports = router;
