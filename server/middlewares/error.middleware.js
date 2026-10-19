const errorMiddleware = (error, req, resp, next) => {

    console.log("Error Occured: ", error.message)
    console.log(error)

    // mongoose validation errors should not be shown raw to the user
    if (error.name === "ValidationError") {
        return resp.status(400).json({
            success: false,
            msg: "Please fill all the required fields correctly."
        })
    }

    const statusCode = error.statusCode || 500

    resp.status(statusCode).json({
        success: false,
        msg: statusCode === 500 ? "Something went wrong. Please try again later." : error.message
    })
}

export default errorMiddleware;