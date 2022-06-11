const fs = require('fs').promises;
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const _ = require('lodash');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const host = 'localhost';
const port = process.env.PORT || 8000;
const { v4: uuid } = require('uuid');

const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);

const controller = require('./controllers/controller.js');
const router = require('./routes/router')

app.use(express.static(__dirname + '/public'));

const {MongoClient} = require('./db.js');

const ModelData = require('./models/modelData')

app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 200 * 1024 * 1024 * 1024 //200MB max file(s) size
    },
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
express.json();
express.urlencoded();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(path.join(__dirname, '../views')));
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', router)
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
