const express = require('express');
const blogControler = require('../controllers/blog.controller');
const router = express.Router();
const path = require('path');
const verifyAccessToken = require('../middleware/verifyAccessToken');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'blogs',
    public_id: (req, file) =>
      `${path.basename(
        file.originalname,
        path.extname(file.originalname)
      )}_${Date.now()}`,
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 20000000, files: 1 } });

router.get('/get-all', blogControler.getAllBlog);
router.post('/create', verifyAccessToken, upload.single('banners'), blogControler.createBlog);
router.get('/get-one/:id', blogControler.getBlog);
router.put('/update/:id', verifyAccessToken, upload.single('banners'), blogControler.updateBlog);
router.delete('/delete/:id', verifyAccessToken, blogControler.deleteBlog);

module.exports = router;
