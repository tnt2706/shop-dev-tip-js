const { Product } = require('../product.model');

const { getSelectData, unGetSelectData, removeNilObject, flattenObj } = require('../../utils');

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

const findAllProducts = async ({ limit, page, select, filter, sort }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

  const products = Product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();

  return products;
};

const findProductById = async ({ product_id, unselect }) => {
  const product = Product.findById(product_id)
    .select(unGetSelectData(unselect))
    .lean();

  return product;
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

const updateProductById = async (product_id, bodyUpdate, model) => {
  const objectParams = removeNilObject(bodyUpdate);
  const result = await model.findByIdAndUpdate(product_id, flattenObj(objectParams), { new: true }).lean();
  return result;
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

const checkProductByServer = async products => {
  const promises = products.map(async p => {
    const foundProduct = await Product.findById(p.productId).select('product_price').lean();
    if (foundProduct) {
      return {
        price: foundProduct.product_price,
        quantity: p.quantity,
        productId: p.productId,
      };
    }
  });

  const results = await Promise.all(promises);

  return results;
};

module.exports = {
  findAllDraftsForShop,
  findAllPublishForShop,
  getListSearchProduct,
  findAllProducts,
  findProductById,
  publishProductByShop,
  unpublishProductByShop,
  updateProductById,
  checkProductByServer,
};
