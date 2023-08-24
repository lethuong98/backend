const express = require('express');
const sizeControler = require('../controllers/size.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const verifyAccessToken = require('../middleware/verifyAccessToken');

router.get('/get-all', sizeControler.getSizes);
router.post('/create', verifyAccessToken, upload.none(), sizeControler.createSize);
router.get('/get-one/:id', sizeControler.getSize);
router.put('/update/:id', verifyAccessToken, upload.none(), sizeControler.updateSize);
router.delete('/delete/:id', verifyAccessToken, sizeControler.deleteSize);

module.exports = router;
