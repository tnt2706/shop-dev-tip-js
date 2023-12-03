const { Product } = require('../product.model');

const findAllDraftsForShop = async ({ query, limit, skip }) => await queryProduct({ query, limit, skip });

const findAllPublishForShop = async ({ query, limit, skip }) => await queryProduct({ query, limit, skip });

const getListSearchProduct = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const products = await Product.find(
    { $text: { $search: regexSearch }, isDraft: false },
    { score: { $meta: 'textScore' } },
  ).sort({ score: { $meta: 'textScore' } }).lean();

  return products;
};

const publishProductByShop = async (product_shop, product_id) => {
  const product = await Product.findOne({ product_shop, _id: product_id }).select('_id').lean();
  if (!product) return null;

  const { modifiedCount } = await Product.updateOne(
    { _id: product_id },
    { $set: { isDraft: false, isPublished: true } },
  );

  return modifiedCount;
};

const unpublishProductByShop = async (product_shop, product_id) => {
  const product = await Product.findOne({ product_shop, _id: product_id }).select('_id').lean();
  if (!product) return null;

  const { modifiedCount } = await Product.updateOne(
    { _id: product_id },
    { $set: { isDraft: true, isPublished: false } },
  );

  return modifiedCount;
};

const queryProduct = async ({ query, limit, skip }) => {
  const products = Product.find(query).populate('product_shop', 'name email -_id')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();

  return products;
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  getListSearchProduct,
  publishProductByShop,
  unpublishProductByShop,
};
