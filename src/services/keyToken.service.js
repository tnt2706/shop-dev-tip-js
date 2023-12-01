const { KeyToken } = require('../models');


class KeyTokenService {

  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      const token = await KeyToken.findOneAndUpdate(
        { user: userId },
        { publicKey, privateKey, refreshToken, refreshTokenUsed: [] },
        { upsert: true, new: true }
      ).lean()

      return token ? token.publicKey : null;

    } catch (error) {
      return error;
    }
  }


  static findByUserId = async (userId) => {
    return await KeyToken.findOne({ user: userId }).lean();
  }

  static removeKeyById = async (_id) => {
    await KeyToken.deleteOne({ _id });
  }

  static findByRefreshToken = async (refreshToken) => {
    return await KeyToken.findOne({ refreshToken }).lean()
  }

  static deleteKeyByUserId = async (userId) => {
     await KeyToken.deleteOne({ user: userId })
  }

  static updateRefreshToken = async (refreshToken, oldRefreshToken) => {
    await KeyToken.updateOne(
      { refreshToken: oldRefreshToken },
      {
        $set: { refreshToken },
        $addToSet: { refreshTokenUsed: oldRefreshToken }
      },
      { new: true, upsert: true }
    ).lean()
  }



}

module.exports = KeyTokenService
