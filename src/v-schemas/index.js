const yup = require("yup");
const { taskSchema } = require("../models/task");

const getAllTaskQuerySchema = yup.object({
    completed: yup.string()
        .nullable()
        .transform((originalValue) => (originalValue === null ? undefined : originalValue)) // Ensures null is treated as undefined
        .test('is-boolean-string', "This 'completed' query value should be either 'true' or 'false'", (value) => {
            return value === "true" || value === "false" || value === undefined;
        })
});

const taskIdSchema = yup.object({
    id: yup
        .number()
        .test('is-valid-number', 'Task id should be of type "number"', (value) => {
            return !isNaN(value);
        })
        .moreThan(0, 'ID must be greater than 0').required(),
});

const prioritySchema = yup.object({
    level: taskSchema.priority.required()
});

module.exports = {
    taskIdSchema,
    prioritySchema,
    getAllTaskQuerySchema,
}