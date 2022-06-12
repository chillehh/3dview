const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const host = 'localhost';
const port = process.env.PORT || 8000;

const router = require('./routes/router')
app.use(express.static(__dirname + '/public'));
require('./db.js');

//Allows file uploads
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

app.use('/', router)

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
