const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const {getArticles} = require("./controllers/articles-controller");
const {statusError500} = require("./controllers/error-handling-controller")

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.use(statusError500);

module.exports = app;
