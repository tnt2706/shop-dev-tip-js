const commentService = require('../services/comment.service')
const { SuccessResponse } = require('../core/success.response')

class CommentController {
  addComment = async (req, res, next) => {
    new SuccessResponse({
      message: "createComment success !",
      metadata: await commentService.createComment(req.body)
    }).send(res)
  };
}

module.exports = new CommentController();
