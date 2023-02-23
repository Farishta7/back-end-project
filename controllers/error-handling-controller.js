//400 error
exports.handlePSQL400s = (error, request, response, next) => {
    console.log(error.code)
    if (error.code === "22P02") {
        response.status(400).send({message: "Bad request made."})
    } else {
        next(error);
    }
};

// 404 error
exports.handleCustomErrors = (error, request, response, next) => {
    if (error.message && error.status) {
        response.status(error.status).send({message: error.message})
    } else {
        next(error);
    }
}

exports.statusError500 = (error, request, response, next) => {
    console.log(error);
    response.status(500).send({message: "Oopsie! An error has occured."})
}

// we do the above because, we want speficially this error to be sent back to the user when they make the wrong request.

