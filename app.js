const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controller");
const {statusError500} = require("./controller/errorhandlingcontroller");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use(statusError500);

module.exports = app;
