const {fetchTopics} = require("../models/topics-model")

exports.getTopics = (request, response, next) => {
    fetchTopics()
    .then((topicsArray) => {
        response.status(200).send({topics: topicsArray});
    })
    .catch((err) => {
        console.log(err);
        next(err);
    })
}