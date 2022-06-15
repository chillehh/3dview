const express = require('express');

const router = express.Router();
const controller = require('./controllers/controller.js');

router.get('/', controller.test);

router.post('/upload', controller.uploadFile);

router.get('/v/:id', controller.viewFile);

router.get('/files/download/:id', controller.downloadFile);

module.exports = router;