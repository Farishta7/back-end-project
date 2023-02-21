const {fetchArticles} = require("../models/articles-model")

exports.getArticles = (request, response, next) => {
    fetchArticles()
    .then((articlesArray) => {
        response.status(200).send({articles: articlesArray})
    })
    .catch((err) => {
        console.log(err);
        next(err);
    })
}