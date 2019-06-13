const User = require("../models/UserModel");
var bcrypt = require('bcryptjs');

function create(request, response, next) {
    const { username, password } = request.body;
    User.findOne({ username: username},(err,existingUser) => {
       if(existingUser){
           response.send("User already exists")
       }
       else{
           //save the user
           var hash = bcrypt.hashSync(password, 8);
           request.body.password = hash;
           let userObject = {username:username,password:hash}
           let newuser = new User(userObject);
           newuser.save(()=>{
               response.send("User created");
           })
       }
    });
}



exports.create = create;
