exports.handlePSQL400s = (error, request, response, next) => {
    console.log(error);
    if (error.code === "22P02") {
        response.status(400).send({message: "Bad request made."})
    } else if (error.code === "23502") {
        response.status(400).send({message: "Bad request made. Missing required fields."})
    } else if (error.code === "23503" && error.constraint === "comments_author_fkey") {
        response.status(404).send({message: "Bad request made. Username does not exist."})
    } else if (error.code === "23503" && error.constraint === 'comments_article_id_fkey') {
        response.status(404).send({message: "Article id not found."})
    } else {
        next(error);
    }
};

exports.handleCustomErrors = (error, request, response, next) => {
    if (error.message && error.status) {
        response.status(error.status).send({message: error.message})
    } else {
        next(error);
    }
}

// we do the following because, we want speficially this error to be sent back to the user when they make the wrong request.
exports.statusError500 = (error, request, response, next) => {
    console.log(error);
    response.status(500).send({message: "Oopsie! An error has occured."})
}


