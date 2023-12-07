const { unGetSelectData } = require('../../utils');
const Comment = require('../comment.model');

const findLastRightComment = async productId => {
  const comment = await Comment.findOne({ comment_productId: productId })
    .sort({ comment_right: -1 })
    .select('comment_right')
    .lean();

  return comment;
};

const findCommentById = async commentId => {
  const comment = await Comment.findById(commentId).lean();

  return comment;
};

const rearrangeComments = async (productId, commentRightParent) => {
  await Promise.all([
    Comment.updateMany(
      { comment_productId: productId, comment_right: { $gte: commentRightParent } },
      { $inc: { comment_right: 2 } },
    ),

    Comment.updateMany(
      { comment_productId: productId, comment_left: { $gte: commentRightParent } },
      { $inc: { comment_left: 2 } },
    ),
  ]);
};

const rearrangeCommentsWhenDelete = async (productId, width) => {
  await Promise.all([
    Comment.updateMany(
      { comment_productId: productId, comment_right: { $gte: width } },
      { $inc: { comment_right: -width } },
    ),

    Comment.updateMany(
      { comment_productId: productId, comment_left: { $gte: width } },
      { $inc: { comment_left: -width } },
    ),
  ]);
};

module.exports = {
  findLastRightComment,
  findCommentById,
  rearrangeComments,
  rearrangeCommentsWhenDelete,
};
