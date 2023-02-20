const db = require("../db/connection")

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then((topicsArray) => {
        console.log(topicsArray.rows);
        return topicsArray.rows
    })

}