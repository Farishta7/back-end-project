const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const {getArticles, getArticleById, getArticleCommentById, postArticleCommentById, patchArticleCommentById} = require("./controllers/articles-controller");
const {getUsers} = require("./controllers/users-controller")
const {statusError500, handlePSQL400s, handleCustomErrors} = require("./controllers/error-handling-controller")
const cors = require('cors');

app.use(cors());

app.use(express.json()); // first pice of middle-ware. used for post request. 

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleCommentById);

app.post("/api/articles/:article_id/comments", postArticleCommentById);

app.patch("/api/articles/:article_id", patchArticleCommentById);

// app.get("/api/users", getUsers);

app.use(handlePSQL400s)
app.use(handleCustomErrors)
app.use(statusError500);

module.exports = app;
