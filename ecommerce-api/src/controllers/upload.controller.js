const uploadService = require('../services/upload.service')
const { SuccessResponse } = require('../core/success.response')

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: "uploadFile success !",
      metadata: await uploadService.uploadFile(req.body)
    }).send(res)
  };

  uploadFileFromLocal = async (req, res, next) => {
    new SuccessResponse({
      message: "uploadFileFromLocal success !",
      metadata: await uploadService.uploadFileFromLocal(req)
    }).send(res)
  };

  uploadMultipleFileFromLocal = async (req, res, next) => {
    new SuccessResponse({
      message: "uploadMultipleFileFromLocal success !",
      metadata: await uploadService.uploadMultipleFileFromLocal(req)
    }).send(res)
  };
}

module.exports = new UploadController();
