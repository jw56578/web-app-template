const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');

function create(request, response) {
  const { username, password } = request.body;
  User.findOne({username:username},(err,user)=>{
    //comparing plain text to the hash
    if(user && bcrypt.compareSync(password, user.password)){
     //this user is good, what do we need to do
     //we need to create and send back a token
     const timestamp = new Date().getTime();
     const userObj = { userId: user.id, iat: timestamp }
     var token = jwt.sign(userObj, process.env.SECRET);

     response.json({token:token})
    }
    else{
      response.send("Unauthorized")
    }
  })
}
  
exports.create = create;
