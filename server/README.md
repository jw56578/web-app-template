## Deploy to Heroku
The server code is under the root directory which is a the client create-react-app. This is to keep things together for simplicity sake. We can deploy just the server folder to heroku using git subtree


git subtree push --prefix server heroku master