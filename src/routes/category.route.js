const express = require('express');
const categoryControler = require('../controllers/category.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const verifyAccessToken = require('../middleware/verifyAccessToken');

router.get('/get-all', categoryControler.getCategorys);
router.post('/create', verifyAccessToken, upload.none(), categoryControler.createCategory);
router.get('/get-one/:id', categoryControler.getCategory);
router.put('/update/:id', verifyAccessToken, upload.none(), categoryControler.updateCategory);
router.delete('/delete/:id', verifyAccessToken, categoryControler.deleteCategory);

module.exports = router;
