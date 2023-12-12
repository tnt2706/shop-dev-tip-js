const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const { authentication } = require('../../auth/checkAuth');
const uploadController = require('../../controllers/upload.controller');
const { uploadDisk, uploadMemory } = require('../../middlewares/multer.middleware');

const router = express.Router();

// authentication //
router.use(authentication);

router.post('/product', asyncHandel(uploadController.uploadFile));
router.post('/product/thumb', uploadDisk.single('file'), asyncHandel(uploadController.uploadFileFromLocal));
router.post('/product/multiple', uploadDisk.array('files', 5), asyncHandel(uploadController.uploadMultipleFileFromLocal));

router.post('/product/bucket', uploadMemory.single('file'), asyncHandel(uploadController.uploadFileFromLocalToS3));

module.exports = router;
