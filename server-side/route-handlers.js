const Mysql = require('./mysql-connection');

//all of these should take two parameters, req (data about the request), and res (functions that let us respond to the user)
function handleRoot(req, res) {
    res.send("Hello World!");
}

async function getPosts(req, res) {
    try {
        //write out your mysql query
        const query = `
            SELECT
                *
            FROM
                POST
            ORDER BY post_ID DESC
            
        `;

        //gets the results from the mysql server
        let posts = await Mysql.query(query);

        //send the results to the user making the request
        res.send(posts);
    } catch (e) {

        //something went wrong, log the error, return a 500 Internal Server Error
        console.error(e);
        res.sendStatus(500);
    }
}

async function getComments(req, res) {
    try {
        const post = req.params.post;

        const query = `
            SELECT
                *
            FROM
                COMMENTS
            WHERE
                post_ID = ?
        `;

        const comments = await Mysql.query(query, [post]);

        res.send(comments);
    } catch (e) {
        
        //something went wrong, log the error, return a 500 Internal Server Error
        console.error(e);
        res.sendStatus(500);
    }
}

async function putPost(req, res) {
    try {
        const content = req.body.content;
        const user = req.body.user;
        // const liked = req.body.likes;

        const checkQuery = `
            SELECT 
                user_ID
            FROM
                USERS
            WHERE
                user_ID = ?
            
        `;

        const users = await Mysql.query(checkQuery, [user]);
        
        if (users.length === 0) {
            console.log("User does not exist!!!");
            return res.sendStatus(403);
        }

        const query = `
            INSERT INTO
                POST
            SET
                content = ?,
                user_ID = ?
                
        `;
        // liked = ?
        const results = await Mysql.query(query, [content, user]);

        res.sendStatus(200);
    } catch (e) {
        //something went wrong, log the error, return a 500 Internal Server Error
        console.error(e);
        res.sendStatus(500);
    }
}

async function deletePost(req, res) {
    try {
        const post = req.body.post;

        const myquery = `
            DELETE FROM
                POST
            WHERE
                post_ID = ?
            LIMIT 1
        `;

        const results = await Mysql.query(myquery, [post]);

        res.sendStatus(200);
    } catch (e) {
        //something went wrong, log the error, return a 500 Internal Server Error
        console.error(e);
        res.sendStatus(500);
    }
}

async function updatePost(req, res) {
    try {
        const {
            post,
            content
        } = req.body;

        const query = `
            UPDATE
                POST
            SET
                content = ?
            WHERE
                post_ID = ?
            LIMIT 1
        `;

        const results = await Mysql.query(query, [content, post]);

        res.sendStatus(200);
    } catch (e) {
        //something went wrong, log the error, return a 500 Internal Server Error
        console.error(e);
        res.sendStatus(500);
    }
}

async function likePost(req,res){
    try {
        const {
            post,
            like
        } = req.body;

        const query = `
            UPDATE
                POST
            SET
                liked = ?
            WHERE
                post_ID = ?
        `;

        console.log(post, like);
        
        const results = await Mysql.query(query, [like, post]);

        res.sendStatus(200);
    } catch (e) {
        //something went wrong, log the error, return a 500 Internal Server Error
        console.error(e);
        res.sendStatus(500);
    }
}

async function putComment(req, res) {
    try {
        const {
            comment,
            post,
            user
        } = req.body;

        const query = `
            INSERT INTO
                COMMENTS
            SET
                comment = ?,
                user_ID = ?,
                post_ID = ?
        `;
        
        const results = await Mysql.query(query, [comment, user, post]);

        res.sendStatus(200);
    } catch (e) {
        //something went wrong, log the error, return a 500 Internal Server Error
        console.error(e);
        res.sendStatus(500);
    }
}

async function deleteComment(req, res){
    try{
        const {
            comment
        } = req.body;

        const myquery = `
            DELETE FROM
                COMMENTS
            WHERE
                comment_ID = ?
            LIMIT 1
        `;

        const results = await Mysql.query(myquery, [comment]);

        res.sendStatus(200);
    } catch (e){
        //something went wrong, log the error, return a 500 Internal Server Error
        console.error(e);
        res.sendStatus(500);
    }
}

async function updateComment(req, res){
    try{
        const {
            comment,
            commentID
        } = req.body;

        const query = `
            UPDATE
                COMMENTS
            SET
                comment = ?
            WHERE
                comment_ID = ?
        `;

        const results = await Mysql.query(query, [comment, commentID]);

        res.sendStatus(200);
    } catch (e){
        //something went wrong, log the error, return a 500 Internal Server Error
        console.error(e);
        res.sendStatus(500);
    }
}

async function likeComment(req, res){
    try {
        const {
            comment,
            like
        } = req.body;

        const query = `
            UPDATE
                COMMENTS
            SET
                liked = ?
            WHERE
                comment_ID = ?
        `;
        
        const results = await Mysql.query(query, [like, comment]);

        res.sendStatus(200);
    } catch (e) {
        //something went wrong, log the error, return a 500 Internal Server Error
        console.error(e);
        res.sendStatus(500);
    }
}

//list exported functions here
module.exports = {
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
    likeComment,
}