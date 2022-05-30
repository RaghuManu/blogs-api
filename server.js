const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const CONNECTION_URI =process.env.MONGODB_URI || "mongodb://localhost/user"; 

// express app
const app = express();

const environment = process.env.NODE_ENV || "development";
console.log("env ", environment)
console.log("url ",CONNECTION_URI)
const stage = require("./config")[environment];
// connect to mongodb
mongoose.connect(CONNECTION_URI , { useNewUrlParser: true ,useUnifiedTopology: true,})
  .then(()=>console.log('database connected : '+ CONNECTION_URI))
  .catch(err => {
    console.log('DB Connection Error: '+`${err.message}`);
    });

mongoose.connection
  .once("open", function() {
    console.log("connection success");
  })
  .on("error", function(err) {
    console.log("Connection Error", err);
  });

mongoose.Promise = global.Promise;

// use headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use cors
app.use(cors());

// use routes
app.use("/api/user", require("./route/api.js"));

// hadling errors
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ error: err.message });
});

// server listening
/* 
app.listen(`${stage.port}`, () => console.log("server started")); */
app.listen(process.env.PORT || 4000,"0.0.0.0", () => console.log("server started"));
module.exports =app;