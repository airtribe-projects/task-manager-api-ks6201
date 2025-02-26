const { ServerError } = require("../errors/server-error");
const { asyncHandler } = require("../utils");


function queryValidate(
    schema
) {
    return asyncHandler((
        req,
        _res,
        next
    ) => {
        const query = req.query;
        
        try {
            schema.validateSync(query);
            
            next();
        } catch(error) {
            throw new ServerError(error.errors[0], 400);
        }
    });
}

module.exports = {
    queryValidate
}