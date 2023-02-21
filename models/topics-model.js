const db = require("../db/connection")

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then((topicsArray) => {
        return topicsArray.rows
    })

}