const { Shop } = require('../models');

async function shopFindById(_id) {
  const keyStore = await Shop.findById(_id).lean();
  return keyStore;
}

module.exports = {
  shopFindById,
};
