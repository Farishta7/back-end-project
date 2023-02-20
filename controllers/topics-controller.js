const {fetchTopics} = require("../models/topics-model")

exports.getTopics = (request, response, next) => {
    fetchTopics()
    .then
}