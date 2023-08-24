const express = require('express');
const userControler = require('../controllers/user.controller');
const authControler = require('../controllers/auth.controller');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const verifyAccessToken = require('../middleware/verifyAccessToken');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/dbimage/users')); // đường dẫn thư mục để lưu trữ file upload
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      `${path.basename(
        file.originalname,
        path.extname(file.originalname)
      )}_${Date.now()}_${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 20000000, files: 1 } });

// register
router.post('/register', upload.single('none'), userControler.createUser);

// login
router.post('/login', upload.none(), authControler.login);

//refresh token
router.get('/refresh-token', upload.none(), authControler.refreshToken);

//logout
router.post('/logout', verifyAccessToken, upload.none(), authControler.logout);

module.exports = router;
