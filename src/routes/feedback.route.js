const express = require('express');
const categoryControler = require('../controllers/feedback.controller');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const verifyAccessToken = require('../middleware/verifyAccessToken');

router.get('/get-all', categoryControler.getFeedBacks);
router.post('/create', verifyAccessToken, upload.none(), categoryControler.createFeedBack);
router.get('/get-one/:id', verifyAccessToken, categoryControler.getFeedBack);
router.put('/update/:id', verifyAccessToken, upload.none(), categoryControler.updateFeedBack);
router.delete('/delete/:id', verifyAccessToken, categoryControler.deleteFeedBack);

module.exports = router;
