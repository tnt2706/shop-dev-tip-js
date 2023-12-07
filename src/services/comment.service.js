/* eslint-disable no-await-in-loop */
const { BadRequestError } = require('../core/error.response');
const { Comment } = require('../models');
const { findLastRightComment, findCommentById, rearrangeComments } = require('../models/repositories/comment.repo');

class InventoryService {
  static async createComment({ productId, content, userId, parentCommentId = null }) {
    const comment = new Comment({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      const parentComment = await findCommentById(parentCommentId);
      if (!parentComment) {
        throw BadRequestError('Parent comment dose not exists !');
      }
      rightValue = parentComment.comment_right;

      await rearrangeComments(productId, rightValue);
    } else {
      const maxRightComment = await findLastRightComment(productId);
      rightValue = maxRightComment?.comment_right || 1;
    }

    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    const newComment = await comment.save();
    return newComment;
  }

  static async getCommentsByParentId({ productId, parentCommentId = null }) {
    const query = parentCommentId ? { _id: parentCommentId } : { comment_parentId: parentCommentId };
    const parentComment = await Comment.findOne({ ...query, comment_productId: productId })
      .select('comment_right comment_left')
      .lean();

    if (!parentComment) {
      throw new BadRequestError('Parent comment not found !');
    }

    const { comment_right, comment_left } = parentComment;

    const comments = await Comment.find({
      comment_productId: productId,
      comment_left: { $gt: comment_left },
      comment_right: { $lte: comment_right },

    }).lean();

    return comments;
  }
}

module.exports = InventoryService;
