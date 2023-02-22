const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const {getArticles, getArticleById} = require("./controllers/articles-controller");
const {statusError500, handlePSQL400s, handleCustomerErrors} = require("./controllers/error-handling-controller")

app.use(express.json()); // first pice of middle-ware

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById)


app.use(handlePSQL400s)
app.use(handleCustomerErrors)
app.use(statusError500);

module.exports = app;
