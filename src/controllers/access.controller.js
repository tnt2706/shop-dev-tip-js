'use strict'

const accessService= require('../services/access.service')
const {CREATED} = require('../core/success.response')

class AccessController {
  signUp = async (req, res, next) => {
      new CREATED({
        message:"Registered OK !",
        metadata :await accessService.signUp(req.body)
      }).send(res)
  };
}

module.exports = new AccessController();
