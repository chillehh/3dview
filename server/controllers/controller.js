const _ = require('lodash');
const { v4: uuid } = require('uuid');
const ModelData = require('../models/modelData');


const test = async (req, res) => {
    res.render('index.html');
}

const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            // Split by all dots, grab last element in array
            let dots = _.split(file.originalname, '.')
            let extension = dots[dots.length - 1]
            let id
            if (extension !== undefined && extension === 'obj') {
                id = uuid();
                let urls = _.split(id, '-')
                let url = urls[0]
                const newModelData = new ModelData({
                    url: url,
                    path: "./uploads/" + file.filename,
                    name: file.originalname,
                })
                await newModelData.save();
            }
            // send response to the upload route
            let urls = _.split(id, '-')
            let url = urls[0]
            res.set('Content-Type', 'text/html');
            res.send(JSON.stringify(url));
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
            url: req.params.id,
        }
    )
    const filePath = `${__dirname}/../${modelData.path}`;
    console.log(filePath)
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(filePath, modelData.name);
}

module.exports = {
    test,
    uploadFile,
    viewFile,
    downloadFile
}