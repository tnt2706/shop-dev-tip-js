/* eslint-disable no-await-in-loop */
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { Comment } = require('../models');
const { findLastRightComment, findCommentById, rearrangeComments, rearrangeCommentsWhenDelete } = require('../models/repositories/comment.repo');
const { findProductById } = require('./product.service');

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

  /**
     With : right-left+1
     Update all comment has rightOf > rightDelete : -6

   */
  static async deleteComments({ productId, commentId }) {
    const product = await findProductById({ product_id: productId });
    if (!product) {
      throw new NotFoundError('The product not found !');
    }

    const comment = await findCommentById(commentId);
    if (!comment) {
      throw new NotFoundError('The comment not found !');
    }

    const { comment_left, comment_right } = comment;
    const width = comment_right - comment_left + 1;

    await Comment.deleteMany({
      comment_productId: productId,
      comment_left: { $gte: comment_left },
      comment_right: { $lte: comment_right },
    });

    rearrangeCommentsWhenDelete(productId, width);

    return true;
  }
}

module.exports = InventoryService;
