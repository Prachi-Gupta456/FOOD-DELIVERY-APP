const errorMiddleware = (error, req, resp, next) => {
    
    console.log("Error Occured: ", error.message)
    console.log(error)

    const statusCode = error.statusCode || 500
    resp.status(statusCode).json({
        success: false,
        msg: error.message
    })
}

export default errorMiddleware;