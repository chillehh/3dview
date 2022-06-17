const express = require('express');
const router = express.Router();
const controller = require('./controllers/controller.js');
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

router.get('/', controller.test);

router.post('/api/upload', upload.single('file'), controller.uploadFile);

router.get('/v/:id', controller.viewFile);

router.get('/files/download/:id', controller.downloadFile);

module.exports = router;