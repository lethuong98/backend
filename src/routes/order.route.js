const express = require('express');
const orderControler = require('../controllers/order.controller');
const router = express.Router();
const verifyAccessToken = require('../middleware/verifyAccessToken');
const multer = require('multer');
const upload = multer();

router.get('/get-all', orderControler.getOrders);
router.get('/get-count', orderControler.getCountOrder);
router.get('/get-revenue', orderControler.getRevenue);
router.post('/create', verifyAccessToken, upload.none(), orderControler.createOrder);
router.get('/get-one/:id', orderControler.getOrder);
router.delete('/delete/:id', verifyAccessToken, orderControler.deleteOrder);

module.exports = router;
