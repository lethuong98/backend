const express = require('express');
const userControler = require('../controllers/user.controller');
const router = express.Router();
const verifyAccessToken = require('../middleware/verifyAccessToken');
const path = require('path');
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
    folder: 'users',
    public_id: (req, file) =>
      `${path.basename(
        file.originalname,
        path.extname(file.originalname)
      )}_${Date.now()}`,
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 20000000, files: 1 },
});

router.get('/get-author', userControler.getAuthor);
router.get('/get-all', verifyAccessToken, userControler.getUsers);
router.post('/create', verifyAccessToken, upload.single('avatar'), userControler.createUser);
router.get('/get-one/:id', verifyAccessToken, userControler.getUser);
router.put('/update/:id', verifyAccessToken, upload.single('avatar'), userControler.updateUser);
router.put('/change-password/:id', verifyAccessToken, upload.none(), userControler.changePassword);
router.delete('/delete/:id', verifyAccessToken, userControler.deleteUser);

module.exports = router;
