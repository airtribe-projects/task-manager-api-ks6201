const { ServerError } = require("../errors/server-error");

function errorMiddleware(
    err,
    _req,
    res,
    _next
) {

    if(err instanceof ServerError) {
        const response = {
            status: "error",
            error: err.name,
            message: err.message,
        }
        
        return res.status(err.statusCode).json(response);
    }
    
    res.status(500).json({
        status: "error",
        error: "Unknown",
        message: "Something went wrong!",
    });
}

module.exports = {
    errorMiddleware
}