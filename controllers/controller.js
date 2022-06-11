const { response } = require('express');
//a
const ModelData = require('../models/modelData')

const test = async (req, res) => {
    const newModelData = new ModelData({
        dataId: "A",
        path: "path/to/file"
    })

    await newModelData.save();
}