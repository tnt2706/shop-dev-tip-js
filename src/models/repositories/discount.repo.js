const Discount = require('../discount.model');

const { unGetSelectData } = require('../../utils');

const findDiscountCodeByShop = async ({ code, shopId }) => {
  const discount = Discount.findOne({ discount_code: code, discount_shopId: shopId })
    .select(unGetSelectData(['__v']))
    .lean();

  return discount;
};

const findAllDiscountCodeByShop = async ({ filter, sort = "ctime", page, limit ,unSelect}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };

  const discounts = Discount.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect || ['__v']))
    .lean()
    .exec();

  return discounts;
};

module.exports = {
  findDiscountCodeByShop,
  findAllDiscountCodeByShop
};
