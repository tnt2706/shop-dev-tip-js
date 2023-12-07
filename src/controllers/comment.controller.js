const commentService = require('../services/comment.service')
const { SuccessResponse } = require('../core/success.response')

class CommentController {
  addComment = async (req, res, next) => {
    new SuccessResponse({
      message: "addCommentByUser success !",
      metadata: await commentService.addCommentByUser(req.body)
    }).send(res)
  };
}

module.exports = new CommentController();
