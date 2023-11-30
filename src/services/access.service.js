const _ = require('lodash');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const { Shop } = require('../models');

const { createTokenPair } = require('../auth/authUtils');
const keyTokenService = require('./keyToken.service');

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
      return {
        code: 'xxxx',
        message: 'Email already exists !',
      };
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newShop = await Shop.create({ email, name, password: hashPassword, roles: [RoleShop.SHOP] });
    if (newShop) {
      // create private key, public key

      const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs1',
          format: 'pem',
        },
      });

      const publicKeyString = keyTokenService.createKeyToken({ publicKey, shopId: newShop._id });
      if (!publicKeyString) {
        return {
          code: 'xxxx',
          message: 'PublicKeyString error',
        };
      }

      const publicKeyObject = crypto.createPublicKey(publicKey);

      const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey);

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
