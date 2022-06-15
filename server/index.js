const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('./db.js');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(cors());

const router = require('./router');
app.use('/', router)

//Allows file uploads
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 200 * 1024 * 1024 * 1024 //200MB max file(s) size
    },
}));

const host = 'localhost';
const port = process.env.PORT || 8000;

app.listen(port, host, () => console.log(`Server is running on http://${host}:${port}`));