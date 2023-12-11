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
      const bucket = body.bucket || 'product/shopId';

      const promises = files.map(async file => {
        const pathLocal = path.join(__dirname, `../../${file.path}`);

        const result = await cloudinary.v2.uploader.upload(pathLocal, { folder: bucket });
        fs.unlinkSync(pathLocal);

        const { public_id, secure_url } = result;

        return {
          public_id,
          url: secure_url,
          thumb_url: await cloudinary.v2.url(public_id, { width: 450, height: 450 }),
        };
      });

      return Promise.all(promises);
    } catch (error) {
      logger.error('uploadMultipleFileFromLocal :::ERROR', { error: error.message });
    }
  }
}

module.exports = UploadService;

// file1: [
//   {
//     fieldname: 'file1',
//     originalname: '11 copy.jpeg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     destination: 'uploads/',
//     filename: '1702225000684-11 copy.jpeg',
//     path: 'uploads/1702225000684-11 copy.jpeg',
//     size: 68871
//   }
// ],
// file2: [
//   {
//     fieldname: 'file2',
//     originalname: '11.jpeg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     destination: 'uploads/',
//     filename: '1702225000685-11.jpeg',
//     path: 'uploads/1702225000685-11.jpeg',
//     size: 68871
//   }
// ]
