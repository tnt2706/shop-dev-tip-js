const _ = require('lodash');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { Shop } = require('../models');

const { createTokenPair } = require('../auth/authUtils');
const keyTokenService = require('./keyToken.service');
const { BadRequestError}= require('../core/error.response')

const RoleShop = {
  SHOP: 'SHOP',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
  WRITER: 'WRITER',
};

async function signUp({ name, email, password }) {
  try {
    const holderShop = await Shop.findOne({ email }).select('_id').lean();
    if (holderShop) {
       throw new BadRequestError('ERROR: Shop already registered !')
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newShop = await Shop.create({ email, name, password: hashPassword, roles: [RoleShop.SHOP] });
    if (newShop) {
      // create private key, public key

      const publicKey = crypto.randomBytes(64).toString('hex');
      const privateKey = crypto.randomBytes(64).toString('hex');

      const keyStore = await keyTokenService.createKeyToken({ publicKey, privateKey, shopId: newShop._id });
      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'keyStory error',
        };
      }

      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

      return {
        code: 2001,
        metadata: { shop: _.pick(newShop, ['_id', 'name', 'email']), tokens },
      };
    }

    return {
      code: '200',
      metadata: null,
    };
  } catch (error) {
    return { code: 'xxx', message: error.message, status: 'error' };
  }
}

module.exports = {
  signUp,
};
