const express = require('express');
const userControler = require('../controllers/user.controller');
const authControler = require('../controllers/auth.controller');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const verifyAccessToken = require('../middleware/verifyAccessToken');

const upload = multer();

// register
router.post('/register', upload.none(), userControler.createUser);
router.put('/forget-password', upload.none(), userControler.forgetPassword);

// login
router.post('/login', upload.none(), authControler.login);

//refresh token
router.get('/refresh-token', authControler.refreshToken);

//logout
router.post('/logout', verifyAccessToken, upload.none(), authControler.logout);

module.exports = router;
