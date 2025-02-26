const tap = require("tap");
const supertest = require("supertest");
const app = require("../app");
const server = supertest(app);

tap.test("POST /tasks", async(t) => {
  const newTask = {
    title: "New Task",
    description: "New Task Description",
    completed: false,
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.end();
});

tap.test("POST /tasks with invalid data", async(t) => {
  const newTask = {
    title: "New Task",
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 400);
  t.end();
});

tap.test("GET /tasks", async(t) => {
  const response = await server.get("/tasks");
  t.equal(response.status, 200);
  t.hasOwnProp(response.body[0], "id");
  t.hasOwnProp(response.body[0], "title");
  t.hasOwnProp(response.body[0], "description");
  t.hasOwnProp(response.body[0], "completed");
  t.type(response.body[0].id, "number");
  t.type(response.body[0].title, "string");
  t.type(response.body[0].description, "string");
  t.type(response.body[0].completed, "boolean");
  t.end();
});

// custom
tap.test("GET /tasks and all tasks are sorted by creationDate", async(t) => {
  const response = await server.get("/tasks");
  t.equal(response.statusCode, 200, "Response status should be 200");

  const tasks = response.body;

  t.ok(Array.isArray(tasks), "Tasks should be an array");
  
  for (let i = 1; i < tasks.length; i++) {

    // data loading up from json file doesn't have any creationDate
    if(!(tasks[i - 1]?.createdAt && tasks[i]?.createdAt))
        continue;

    t.ok(
      tasks[i - 1].createdAt <= tasks[i].createdAt,
      `Task ${i - 1} should come before task ${i} based on creation date`
    );
  }

  t.end();
});

// custom
tap.test("GET /tasks filters by completion status 'completed=true'", async(t) => {
  const response = await server.get("/tasks?completed=true");

  t.equal(response.statusCode, 200, "Response status should be 200");

  const tasks = response.body;

  t.ok(Array.isArray(tasks), "Tasks should be an array");

  tasks.forEach(task => {
    t.ok(task.completed, "Task should be completed");
  });

  t.end();
});

// custom
tap.test("GET /tasks filters by completion status 'completed=false'", async(t) => {
  const response = await server.get("/tasks?completed=false");

  t.equal(response.statusCode, 200, "Response status should be 200");

  const tasks = response.body;

  t.ok(Array.isArray(tasks), "Tasks should be an array");

  tasks.forEach(task => {
    t.notOk(task.completed, "Task should not be completed");
  });

  t.end();
});

// custom
tap.test("GET /tasks returns error for invalid completed query", async(t) => {
  const response = await server.get("/tasks?completed=invalid");

  t.equal(response.statusCode, 400, "Response status should be 400 for invalid query");

  t.end();
});

// custom
tap.test("GET /tasks/priority/:id get task by priority.", async(t) => {
  const newTasks = [
    {
      title: "New Task",
      description: "New Task Description",
      completed: false,
      priority: "low"
    },
    {
      title: "Medium",
      description: "New Medium Tasks",
      completed: false,
      priority: "medium"
    },
    {
      title: "Now22",
      description: "New Tasks",
      completed: false,
      priority: "high"
    },
  ]

  for(const newTask of newTasks) {
    const response = await server.post("/tasks").send(newTask);
    t.equal(response.status, 201);
  }
    
  // low
  let response = await server.get("/tasks/priority/low");
  t.equal(response.status, 200);
  t.match(response.body[0], newTasks[0]);  

  // medium
  response = await server.get("/tasks/priority/medium");
  t.equal(response.status, 200);
  t.match(response.body[0], newTasks[1]);
  
  // high
  response = await server.get("/tasks/priority/high");
  t.equal(response.status, 200);  
  
  t.match(response.body[0], newTasks[2]);
  
  t.end();
});

tap.test("GET /tasks/:id", async(t) => {
  const response = await server.get("/tasks/1");
  t.equal(response.status, 200);
  const expectedTask = {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
  };
  t.match(response.body, expectedTask);
  t.end();
});

tap.test("GET /tasks/:id with invalid id", async(t) => {
  const response = await server.get("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id", async(t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 200);
  t.end();
});

tap.test("PUT /tasks/:id with invalid id", async(t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: true,
  };
  const response = await server.put("/tasks/999").send(updatedTask);
  t.equal(response.status, 404);
  t.end();
});

tap.test("PUT /tasks/:id with invalid data", async(t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Description",
    completed: "true",
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 400);
  t.end();
});

tap.test("DELETE /tasks/:id", async(t) => {
  const response = await server.delete("/tasks/1");
  t.equal(response.status, 200);
  t.end();
});

tap.test("DELETE /tasks/:id with invalid id", async(t) => {
  const response = await server.delete("/tasks/999");
  t.equal(response.status, 404);
  t.end();
});

tap.teardown(() => {
  process.exit(0);
});
