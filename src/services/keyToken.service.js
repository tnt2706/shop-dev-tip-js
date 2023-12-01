const { KeyToken } = require('../models');


class KeyTokenService{

  static  createKeyToken = async ({ shopId, publicKey, privateKey, refreshToken }) =>{
    try {
      const token = await KeyToken.findOneAndUpdate(
        { user: shopId },
        { publicKey, privateKey, refreshToken, refreshTokenUsed:[] },
        { upsert: true, new: true }
      ).lean()

      return token ? token.publicKey : null;

    } catch (error) {
      return error;
    }
  }

  static findByUserId =  async (userId) =>{
    return await KeyToken.findOne({user:userId}).lean();
  }

  static removeKeyById =  async (_id) =>{
     await KeyToken.deleteOne({_id});
  }

}

module.exports = KeyTokenService
