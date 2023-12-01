const JWT = require('jsonwebtoken');

const { ApiKey } = require('../models');

const keyTokenService = require('../services/keytoken.service');
const { asyncHandel } = require('../helpers/asyncHelper');
const { AuthFailureError, NotFoundError } = require('../core/error.response');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
  CLIENT_ID: 'x-client-id',
  REFRESH_TOKEN: 'x-rtoken-id',
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    const objKey = await ApiKey.findOne({ key, status: true }).lean();
    if (!objKey) {
      return res.status(403).json({
        message: 'Key not found',
      });
    }

    req.objKey = objKey;
    next();
  } catch (error) {
    console.log(error);
  }
};

const permission = permission => (req, res, next) => {
  if (!req.objKey.permissions?.length) {
    return res.status(403).json({
      message: 'Permission denied',
    });
  }

  const validPermission = req.objKey.permissions.includes(permission);
  if (!validPermission) {
    return res.status(403).json({
      message: 'Permission denied',
    });
  }

  return next();
};

const authentication = asyncHandel(async (req, res, next) => {
  try {
    const userId = req.headers[HEADER.CLIENT_ID];
    if (!userId) {
      throw new AuthFailureError('Invalid request');
    }

    const keyStore = await keyTokenService.findByUserId(userId);
    if (!keyStore) {
      throw new NotFoundError('Not found key store');
    }

    const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
    if (refreshToken) {
      const decodeUser = await JWT.verify(refreshToken, keyStore.privateKey);
      if (decodeUser.userId !== userId) {
        throw new AuthFailureError('Invalid token');
      }

      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      req.user = decodeUser;
      return next();
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if (!accessToken) {
      throw new AuthFailureError('Access token request');
    }

    const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
    if (decodeUser.userId !== userId) {
      throw new AuthFailureError('Invalid token');
    }

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log(error);
  }
});

module.exports = {
  apiKey,
  permission,
  authentication,
};
