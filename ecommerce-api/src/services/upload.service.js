const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary');

class UploadService {
  static async uploadFile() {
    try {
      const url = 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg';
      const folder = 'product/shopId';

      const result = await cloudinary.v2.uploader.upload(url, { folder });

      const { public_id, secure_url } = result;

      return {
        public_id,
        url: secure_url,
        thumb_url: await cloudinary.v2.url(public_id, { width: 450, height: 450 }),
      };
    } catch (error) {
      logger.error('uploadSingleFile :::ERROR', { error: error.message });
    }
  }

  static async uploadFileFromLocal({ file, body }) {
    try {
      const bucket = body.bucket || 'product/shopId';
      const pathLocal = path.join(__dirname, `../../${file.path}`);

      const result = await cloudinary.v2.uploader.upload(pathLocal, { folder: bucket });
      fs.unlinkSync(pathLocal);

      const { public_id, secure_url } = result;

      return {
        public_id,
        url: secure_url,
        thumb_url: await cloudinary.v2.url(public_id, { width: 450, height: 450 }),
      };
    } catch (error) {
      logger.error('uploadSingleFileFromLocal :::ERROR', { error: error.message });
    }
  }

  static async uploadMultipleFileFromLocal({ files, body }) {
    try {

    } catch (error) {
      logger.error('uploadMultipleFileFromLocal :::ERROR', { error: error.message });
    }
  }
}

module.exports = UploadService;
