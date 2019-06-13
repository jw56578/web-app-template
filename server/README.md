## Intro
This project is meant to be an example of how to implement an authentication system on the server. There is no web client so you will need to use postman to test that the server is working. 


## Setup
* fork, clone, npm i, nodemon index.js

## Database
* Make sure you are running a mongoDB database somewhere
* Make sure you have a database setup called “authentication-practice” or similiar
* put your database url in the connect()

## Libraries
* bcryptjs
* jsonwebtoken

## Part 1 - Sign Up
Build the process of signing up for a website. Our simple website will not verify an email is real or check password strength. It will simply make sure the username is unique in the database and then save the user.

### UserModel
* We need to save username and password to the database through mongoose
* Create a mongoose schema and UserModel with keys username, password
* Both username and password should probably be required

### UserController
* Build the create method. At this time we don't need to find or update users.
* The username and password should be on the request body
* Use the UserModel to find a user by username to determine if the username exists already
* If username exist `response.send("username already exists")`
* If username doesn't exist, save the user and `response.send("user created")`

### Test
* Use postman to make a POST request to `/api/users`
* `send a body {"username":"someusername","password":"somepassword"}`
* What is returned?
* Send another request with the same body, what is returned?

## Part 2 - Hash
We see that we are saving the password in the database in plain text. Any employee or hacker could steal this information. We need to implement hashing to hide the password.

### UserController
* Change the code to use bcryptjs to hash the password with `hashSync`
* Save the hashed password to the database instead of plain text

### Test
* Use postman to make a POST request to `/api/users`
* `send a body {"username":"someusername","password":"somepassword"}`
* Look at your database. What does the password look like?

## Part 3 - Sign In
Now that we are a valid user in the system. We have our identity and our proof. We need to be able to re authenticate ourselves with the server at a later time by giving them our identity and proof.

### SessionController
* Build the create function. We don't need to find or update sessions.
* The body will contain username and password
* Use the UserModel to find a user by username. This is how we look up somebody's identify.
* If no user is found `response.send("username not found")`
* Prove that the user is who they say they are by using the bcrypt `compareSync` function to compare the given password to the one from the database
* If the user is valid then create a token from an object that contains the user id. Use json web token `sign` function to do this passing in the object and a secret key.
* Return the token to the client

### Test
* Use postman to make a POST request to `/api/sessions`
* `send a body {"username":"someusername","password":"somepassword"}`
* Does the token get returned? Save the token.

## Part 4 - Authentication
A user can now sign up and sign in. We need to secure the server so that only valid users can access data and only access their own data.

### services/authentication.js
* Extract the token from a header called `token`
* The token is a locked string that we need to unlock by using the jwt `verify` function. Call the function passing in the token string and the secret key. Make sure to use try/catch
* If there is no error, put the userId on the request object and call `next()`
* If there is an error, return the message `unauthorized`

### Test
* Use postman to make a GET request to `/api/secretinformation`
* Include a token in the header `token`
* Can you access the secret information?

## Part 5 - User Data
A user should only be able to access their own data. We need to setup some data that is user specific and make sure we can only retrieve it if they have signed in with the correct username/password.

### Data
* Create a collection in your database for whatever you want such as tweets
* Make sure there is a userId field
* Manually enter some test data and associate the documents to different userIds

### Model
* Create a mongoose model for whatever collection you made such as Tweet
* Create a route for a GET to a path such as `/api/tweets`
* Use the model find() function to retrieve the data by user id
* Return the data to the client

### Test
* Use postman to make a GET request to `/api/tweets`
* Include a token in the header `token`
* Does the server return the data only for the specific user.

