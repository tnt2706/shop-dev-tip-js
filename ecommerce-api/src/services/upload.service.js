const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const cloudinary = require('cloudinary');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const config = require('../configs');

const client = new S3Client({ region: config.s3.region });

class UploadService {
  // Cloudinary
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

  // AWS S3

  static async uploadFileFromLocalToS3({ file }) {
    try {
      const key = crypto.randomBytes(16).toString('hex');

      const putCommand = new PutObjectCommand({
        Key: key,
        Body: file.buffer,
        Bucket: config.s3.shopBucket,
        ContentType: 'image/jpeg',
      });

      await client.send(putCommand);

      const command = new GetObjectCommand({ Bucket: config.s3.shopBucket, Key: key });
      const url = getSignedUrl(client, command, { expiresIn: config.s3.shopBucketExpires });
      return url;
    } catch (error) {
      logger.error('uploadFileFromLocalToS3 :::ERROR', { error: error.message });
    }
  }
}

module.exports = UploadService;
