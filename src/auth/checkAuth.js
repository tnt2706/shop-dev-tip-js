const crypto = require('crypto');

const { ApiKey } = require('../models');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: 'Forbidden Error',
      });
    }

    // await ApiKey.create({ key: crypto.randomBytes(64).toString('hex'), permissions: ['0000'] });

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

module.exports = {
  apiKey,
  permission,
};
