require('dotenv').config(); //reads our .env file and makes it available

//import our packages to get things ready
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//sets what port to listen on
const port = 8080;

//you don't need to mess with this - this just means that the API will accept
//requests from anywhere on the internet
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//imports the handlers for the routes - add more here as you write more route handlers
const {
    handleRoot,
    getPosts,
    putPost,
    deletePost,
    updatePost,
    likePost,
    putComment,
    getComments,
    deleteComment,
    updateComment,
    likeComment
} = require('./route-handlers');

//tells the API we're writing here to accept/return JSON data
app.use(bodyParser.json());

//here you tell it what routes you want to listen on and what
//function you want to handle the request
//add more routes below when you want to listen on more routes
app.get('/', handleRoot);

app.get('/posts', getPosts);

app.get('/get-comments/:post', getComments);

app.post('/put-post', putPost);

app.post('/delete-post', deletePost);

app.post("/update-post", updatePost);

app.post("/like-post", likePost);

app.post("/put-comment", putComment);

app.post("/delete-comment", deleteComment);

app.post("/update-comment", updateComment);

app.post("/like-comment", likeComment);

//listen on port 8080 and handle incoming requests
app.listen(port, () => {
    console.log("Open localhost:8080 in the browser!");
});