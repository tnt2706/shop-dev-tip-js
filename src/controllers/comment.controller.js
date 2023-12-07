const commentService = require('../services/comment.service')
const { SuccessResponse } = require('../core/success.response')

class CommentController {
  addComment = async (req, res, next) => {
    new SuccessResponse({
      message: "createComment success !",
      metadata: await commentService.createComment(req.body)
    }).send(res)
  };

  getCommentsByParentId = async (req, res, next) => {
    new SuccessResponse({
      message: "getCommentsByParentId success !",
      metadata: await commentService.getCommentsByParentId(req.query)
    }).send(res)
  };

  deleteComments = async (req, res, next) => {
    new SuccessResponse({
      message: "deleteComment success !",
      metadata: await commentService.deleteComments(req.body)
    }).send(res)
  };
}

module.exports = new CommentController();
