const mongoose = require('mongoose');
var Schema = mongoose.Schema

const modelDataShema = new mongoose.Schema({
    id: Schema.Types.ObjectId,
    dataId: String,
    path: String  
}, {collection: 'modelData'})

const ModelData = mongoose.model('modelData', modelDataShema)
module.exports = ModelData;