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
let indexFile;

app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 200 * 1024 * 1024 * 1024 //200MB max file(s) size
    },
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(indexFile);
});

fs.readFile(__dirname + "/index.html")
    .then(contents => {
        indexFile = contents;
        app.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });

app.post('/upload', async (req, res) => {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let file = req.files.fileInput;
            file.mv('./uploads/' + file.name);

            // send response to the upload route
            // TODO: redirect to 3D viewer page with response data
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

