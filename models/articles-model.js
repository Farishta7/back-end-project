const db = require("../db/connection")

exports.fetchArticles = () => {
    return db
    .query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST(COUNT(comments.article_id) AS int) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id GROUP BY articles.article_id;`)
    .then((result) => {
        return result.rows
    })
}

exports.fetchArticleById = (article_id) => {
    return db
    .query(`SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, articles.body FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
        if(result.rows.length === 0) {
            // The following is related to "handleCustomerErrors" in "error-handling-controller.js":
            return Promise.reject({message: 'Article id not found.', status: 404})
        } else {
            return result.rows[0];
        }
        
    })
}