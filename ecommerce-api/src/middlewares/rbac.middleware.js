const AccessControl = require('accesscontrol');
const { AuthFailureError } = require('../core/error.response');

const grantList = [
  { role: 'admin', resource: 'profile', action: 'read:any', attributes: '*' },
  { role: 'shop', resource: 'profile', action: 'read:own', attributes: '*' },
];

const ac = new AccessControl(grantList);

const grantAccess = (action, resource) => async (req, res, next) => {
  try {
    const roleName = req.query.role;
    const permission = ac.can(roleName)[action](resource);
    if (!permission.granted) {
      throw new AuthFailureError("You don't not enough permissions");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { grantAccess };
