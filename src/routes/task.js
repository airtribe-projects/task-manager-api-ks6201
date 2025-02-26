const { Router } = require("express");
const {
    validateTaskSchema,
} = require("../middlewares/task");

const { 
    getTaskByPriority,
    getAllTasksController,
    getTaskByIdController,
    createNewTaskController,
    updateTaskByIdController,
    deleteTaskByIdController,
} = require("../controllers/task");
const { queryValidate } = require("../middlewares/query-validate");
const { paramsValidate } = require("../middlewares/params-validate");
const { taskIdSchema, getAllTaskQuerySchema, prioritySchema } = require("../v-schemas");

const taskRoute = Router();

taskRoute.get("/", queryValidate(getAllTaskQuerySchema), getAllTasksController);

taskRoute.get("/:id", paramsValidate(taskIdSchema), getTaskByIdController);

taskRoute.get("/priority/:level", paramsValidate(prioritySchema), getTaskByPriority);

taskRoute.post("/", validateTaskSchema, createNewTaskController);

taskRoute.put(
    "/:id", 
    paramsValidate(taskIdSchema), 
    validateTaskSchema,
    updateTaskByIdController
);

taskRoute.delete("/:id", paramsValidate(taskIdSchema), deleteTaskByIdController);

module.exports = taskRoute;