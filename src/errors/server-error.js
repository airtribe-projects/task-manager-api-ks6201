
class ServerError extends Error {
    statusCode;
    constructor(
        message,
        statusCode
    ) {
        super(message);
        this.name = "ServerError";
        this.statusCode = statusCode;
    }
}

module.exports = {
    ServerError
}