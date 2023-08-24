const express = require('express');
const colorControler = require('../controllers/color.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const verifyAccessToken = require('../middleware/verifyAccessToken');

router.get('/get-all', colorControler.getColors);
router.post('/create', verifyAccessToken, upload.none(), colorControler.createColor);
router.get('/get-one/:id', colorControler.getColor);
router.put('/update/:id', verifyAccessToken, upload.none(), colorControler.updateColor);
router.delete('/delete/:id', verifyAccessToken, colorControler.deleteColor);

module.exports = router;
