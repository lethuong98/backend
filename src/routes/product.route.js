const express = require('express');
const productControler = require('../controllers/product.controller');
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
    folder: 'products',
    public_id: (req, file) =>
      `${path.basename(
        file.originalname,
        path.extname(file.originalname)
      )}_${Date.now()}`,
  },
});

const upload = multer({ storage: storage, limits: { fileSize: 600000, files: 30 } });

router.get('/get-all', productControler.getProducts);
router.get('/best-seller', productControler.getTopFiveBestSeller);
router.post('/create', verifyAccessToken, upload.array('gallery'), productControler.createProduct);
router.get('/get-one/:id', productControler.getProduct);
router.put(
  '/update/:id',
  verifyAccessToken,
  upload.array('gallery'),
  productControler.updateProduct
);
router.delete('/delete/:id', verifyAccessToken, productControler.deleteProduct);
router.put('/toggle-new/:id', verifyAccessToken, upload.none(), productControler.toggleNewProduct);
router.put(
  '/toggle-sale/:id',
  verifyAccessToken,
  upload.none(),
  productControler.toggleSaleProduct
);

module.exports = router;
