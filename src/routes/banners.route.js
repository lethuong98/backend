const express = require('express');
const bannersControler = require('../controllers/banners.controller');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const verifyAccessToken = require('../middleware/verifyAccessToken');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'banners',
    public_id: (req, file) =>
      `${path.basename(
        file.originalname,
        path.extname(file.originalname)
      )}_${Date.now()}`,
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 20000000, files: 1 } });

router.get('/get-all', bannersControler.getAllBanners);
router.post('/create', verifyAccessToken, upload.single('preview'), bannersControler.createBanners);
router.get('/get-one/:id', verifyAccessToken, bannersControler.getBanners);
router.put(
  '/update/:id',
  verifyAccessToken,
  upload.single('preview'),
  bannersControler.updateBanners
);
router.delete('/delete/:id', verifyAccessToken, bannersControler.deleteBanners);

module.exports = router;
