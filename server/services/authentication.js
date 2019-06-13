const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function authentication(request, response,next) {
  //we are only securing the data in the api, not static resources
  if(request.path.split("/")[1] !== "api")
  {
    return next();
  }
  const  token = request.header("token")
  try{
    var userObject = jwt.verify(token, process.env.SECRET);
    //{userId:33}
    //the token is good
    request.userId = userObject.userId;
    next();
  }
  catch{
    response.send("Unauthorized")
  }
  return;
  //do we need to put the entire user object on the request?
  User.findOne({username:username},(err,user)=>{
    //comparing plain text to the hash
    if(user && bcrypt.compareSync(password, user.password)){
      next();
    }
    else{
      response.send("Unauthorized")
    }
  })
  
}

exports.authentication = authentication;
