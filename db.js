const mongoose = require('mongoose')
// mongoose.set('useFindAndModify', false);
var Schema = mongoose.Schema
const dotenv = require('dotenv');
dotenv.config({path: __dirname + '/.env'});
let mongoUser = process.env.MONGO_USERNAME;
let mongoPassword = process.env.MONGO_PASSWORD;
let connectionURL = "mongodb+srv://" + mongoUser + ":" + mongoPassword + "@3dviewcluster.mjkkg.mongodb.net/?retryWrites=true&w=majority"
console.log(connectionURL)
try {
    // Connect to the MongoDB cluster
     mongoose.connect(
      connectionURL,
      {useNewUrlParser: true, useUnifiedTopology: true, dbName: '3dviewerdb'},
      () => console.log("Mongoose is connected")
    );

  } catch (e) {
    console.log("could not connect");
  }
const db = mongoose.connection
// event handlers
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('connected to Mongo')
})