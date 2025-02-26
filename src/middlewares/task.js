const { asyncHandler } = require("../utils");
const { ServerError } = require("../errors/server-error");
const { createTaskSchema, taskIdSchema } = require("../models/task");


const validateTaskSchema = asyncHandler((req, _res, next) => {    
    const newTask = req.body;

    try {        
        createTaskSchema.validateSync(newTask);        
        next();
    } catch(error) {        
        throw new ServerError(error.errors[0], 400);
    }
});

const validateTaskId = asyncHandler((req, _res, next) => {
    const id = req.params.id;
    
    const isValid = taskIdSchema.isValidSync(+id, { abortEarly: false });
    
    if(!isValid)
        throw new ServerError("Task id should be of type 'number'", 403);
    
    next();
});

module.exports = {
    validateTaskId,
    validateTaskSchema
}