const express = require('express');
const taskRoute = require("./src/routes/task");
const { errorMiddleware } = require("./src/middlewares/error-handler");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/tasks", taskRoute);

app.use(errorMiddleware);

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});


module.exports = app;