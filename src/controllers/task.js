const { tasks } = require("../models/task");

function createNewTaskController(req, res) {
    const task = req.body;

    const id = tasks.length + 1;
    
    tasks.push({
        id,
        priority: task?.priority ?? "low",
        createdAt: new Date().getTime(),
        ...task
    });
    res.status(201).send(`Task created successfully with Id: ${id}.`);
}

function getAllTasksController(req, res) {
    const completed = req.query.completed;

    if(completed) {
        const filteredTask = tasks
            .filter(task => task.completed.toString() === completed)
            .sort((a, b) => a.createdAt - b.createdAt);
            return res.json(filteredTask);
        }
        
    res.json(
        tasks.sort((a, b) => a.createdAt - b.createdAt)
    );
}

function getTaskByPriority(req, res) {
    const priority = req.params.level;

    const filteredTask = tasks.filter(tasks => tasks.priority === priority);

    res.json(filteredTask);
}

function getTaskByIdController(req, res) {
    const id = parseInt(req.params.id);

    const taskIdx = tasks.findIndex(task => task.id === id);

    if(taskIdx === -1) {
        res.status(404).send(`Task with id '${id} not found.'`);
        return;
    }

    res.json(tasks[taskIdx]);
}

function updateTaskByIdController(req, res) {
    const task = req.body;

    const id = parseInt(req.params.id);

    const taskIdx = tasks.findIndex(task => task.id === id);

    if(taskIdx === -1) {
        res.status(404).send(`Task with id '${id} not found.'`);
        return;
    }

    tasks[taskIdx] = {
        id: tasks[taskIdx].id,
        ...task
    }

    res.send(`Task updated having id ${id}`);
}

function deleteTaskByIdController(req, res) {
    const id = parseInt(req.params.id);

    const taskIdx = tasks.findIndex(task => task.id === id);

    if(taskIdx === -1) {
        res.status(404).send(`Task with id '${id} not found.'`);
        return;
    }

    tasks.splice(taskIdx, 1);

    res.send(`Task deleted having id ${id}`);
}

module.exports = {
    createNewTaskController,
    getAllTasksController,
    getTaskByPriority,
    getTaskByIdController,
    updateTaskByIdController,
    deleteTaskByIdController,
}