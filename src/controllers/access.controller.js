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

  login = async (req, res, next) => {
    new CREATED({
      message:"Login success !",
      metadata :await accessService.login(req.body)
    }).send(res)
  };

  logout = async (req, res, next) => {
    new CREATED({
      message:"Logout success !",
      metadata :await accessService.logout(req.keyStore)
    }).send(res)
  };
}

module.exports = new AccessController();
