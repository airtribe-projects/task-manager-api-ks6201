const yup = require("yup");
const tasksObj = require("../../task.json");

const taskPriorityEnum = ["low", "medium", "high"];
const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

const taskSchema = {
    title: yup.string().required(),
    createdAt: yup.string().matches(dateRegex, 'Date must be in the format dd/mm/yyyy'),
    description: yup.string().required(),
    completed: yup.boolean().required().strict(),
    priority: yup.mixed().oneOf(
        taskPriorityEnum,
        `Priority must be one of ${taskPriorityEnum.join(", ")}`
    ),
}

const createTaskSchema = yup.object(taskSchema);

const creationDateSchema = yup.object({
    createdAt: taskSchema.createdAt.required()
});

module.exports = {
    taskSchema,
    createTaskSchema,
    creationDateSchema,
    tasks: tasksObj.tasks,
}