'use strict'

const accessService= require('../services/access.service')

class AccessController {
  signUp = async (req, res, next) => {
      console.log(`[P]::Signup`, req.body)
      return res.status(200).json(accessService.signUp(req.body))
  };
}

module.exports = new AccessController();
