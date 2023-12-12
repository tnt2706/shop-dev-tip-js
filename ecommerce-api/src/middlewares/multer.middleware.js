const multer = require('multer');

const storageDisk = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const storageMemory = multer.memoryStorage();

const uploadDisk = multer({ storage: storageDisk });
const uploadMemory = multer({ storage: storageMemory });

module.exports = { uploadDisk, uploadMemory };
