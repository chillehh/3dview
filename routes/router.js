const express = require('express');
const _ = require('lodash');
const { v4: uuid } = require('uuid');
const bodyParser = require('body-parser');
const ModelData = require('../models/modelData')
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const router = express.Router();
const controller = require('../controllers/controller.js');

router.get('/', (req, res) => {
    res.render("index.html");
});

router.post('/upload', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            console.log(__dirname);
            console.log(req.files);
            let file = req.files.fileInput;
            console.log('A');
            // Split by all dots, grab last element in array
            let dots = _.split(file.name, '.')
            console.log('B');
            let extension = dots[dots.length - 1]
            let id
            console.log('c');
            console.log(req.files);
            if (extension !== undefined && extension === 'obj') {
                console.log('HAVE extension, > add to db')
                id = uuid();
                console.log(id)
                let urls = _.split(id, '-')
                let url = urls[0]
                const newModelData = new ModelData({
                    dataId: url,
                    path: "../uploads/" + file.name,
                })
                await newModelData.save();
            }
            file.mv('../uploads/' + file.name);

            // send response to the upload route
            let urls = _.split(id, '-')
            let url = urls[0]
            res.redirect('/v/' + url);
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/v/:id', async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        // Find document by id
        const modelData = await ModelData.findOne(
            {
                dataId: id,
            }
        )
        console.log(modelData)
        res.render('viewer.html');
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router