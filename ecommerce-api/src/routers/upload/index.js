const express = require('express');

const { asyncHandel } = require('../../helpers/asyncHelper');
const { authentication } = require('../../auth/checkAuth');
const uploadController = require('../../controllers/upload.controller');
const upload = require('../../middlewares/multer.middleware');

const router = express.Router();

// authentication //
router.use(authentication);

router.post('/product', asyncHandel(uploadController.uploadFile));
router.post('/product/local', upload.single('file'), asyncHandel(uploadController.uploadFileFromLocal));

router.post('/product/multiple', upload.array('files', 5), asyncHandel(uploadController.uploadMultipleFileFromLocal));

module.exports = router;
