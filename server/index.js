// dotenv allows us to declare environment variables in a .env file, \
// find out more here https://github.com/motdotla/dotenv
const path = require('path');
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/UserRoutes");
const sessionRoutes = require("./routes/SessionRoutes");
const authMiddleware = require("./services/authentication").authentication;


mongoose.set("debug", true);
mongoose.Promise = global.Promise;
//notice you need to update this with your own database

mongoose.connect(process.env.mongodburi, {useNewUrlParser: true}).then(
  () => { 
    console.log("mongoose connected successfully");
   
    startWebServer();
  },
  err => {
    console.log("mongoose did not connect",err);
   }
);

function startWebServer(){
  const app = express();
  app.get("/api/publicinformation", function (req, res) {
    res.send("Anyone can see this");
  });
  //app.use("/public", express.static(__dirname + "/public"));
  //app.use("/public2", express.static(__dirname + "/public2"));
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: false })) 
  app.use(bodyParser.json());
  app.use("/api",userRoutes);
  app.use("/api",sessionRoutes);
  app.use(authMiddleware);
    //only logged in users should be able to see this information
  app.get("/api/secretinformation", function (req, res) {
    res.send("You got the data. You are authenticated");
  });
  app.get("/api/secret", function (req, res) {
    res.send(`The current user is ${req.user.username}`);
  });

  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
  });

  //heroku injects the port number into the PORT env value
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Listening on port:${port}`);
  });
  }