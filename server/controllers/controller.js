const _ = require('lodash');
const { v4: uuid } = require('uuid');
const ModelData = require('../models/modelData')

const test = async (req, res) => {
    res.render('index.html');
}

const uploadFile = async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let file = req.files.fileInput;
            // Split by all dots, grab last element in array
            let dots = _.split(file.name, '.')
            let extension = dots[dots.length - 1]
            let id
            if (extension !== undefined && extension === 'obj') {
                console.log('HAVE extension, > add to db')
                id = uuid();
                let urls = _.split(id, '-')
                let url = urls[0]
                const newModelData = new ModelData({
                    dataId: url,
                    path: "../uploads/" + file.name,
                })
                await newModelData.save();
            }
            file.mv('./uploads/' + file.name);

            // send response to the upload route
            let urls = _.split(id, '-')
            let url = urls[0]
            res.redirect('/v/' + url);
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

const viewFile = async (req, res) => {
    try {
        res.render('viewer.html');
    } catch (err) {
        res.status(500).send(err);
    }
}

const downloadFile = async (req, res) => {
    const modelData = await ModelData.findOne(
        {
            dataId: req.params.id,
        }
    )
    const filePath = `${__dirname}/../${modelData.path}`;
    console.log(filePath)
    res.download(filePath);
}

module.exports = {
    test,
    uploadFile,
    viewFile,
    downloadFile
}