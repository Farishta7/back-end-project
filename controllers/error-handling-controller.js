exports.statusError500 = (error, request, response, next) => {
    console.log(error);
    response.status(500).send({message: "Oopsie! An error has occured."})
}

// we do the above because, we want speficially this error to be sent back to the user when they make the wrong request.