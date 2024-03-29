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

exports.fetchArticleCommentById = (article_id) => {
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
        if (result.rows.length ===0) {
            return Promise.reject({message: 'Article id not found.', status: 404})
        } else {
            return db
            .query(`SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
            .then((result) => {
                    return result.rows
                
            })
        }
    })    
}

exports.postedComment = (article_id, username, body) => {
    return db
    //for following, we defaulted votes to ZERO incase the incoming body of the post request has the votes set to e.g. 5 already. 
    .query(`INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`, [article_id, username, body])
    .then((result) => {
            return result.rows[0];
    })
};

exports.patchedComment = (inc_votes, article_id) => {
    return db
    .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [inc_votes, article_id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({message: 'Article id not found.', status: 404})
        } else {
            return result.rows[0];
        } 
    })
};

//`UPDATE articles SET votes = votes + 4 WHERE article_id = 1 RETURNING *;`
