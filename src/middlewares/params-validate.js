const { ServerError } = require("../errors/server-error");
const { asyncHandler } = require("../utils");


function paramsValidate(schema) {

    return asyncHandler((req, _res, next) => {
        const params = req.params;
        
        try {
            schema.validateSync(params, { abortEarly: false });
            next();
        } catch(error) {
            throw new ServerError(error.errors[0], 400);
        }        
    });
}

module.exports = {
    paramsValidate
}