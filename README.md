# Task Manager API

The project involves creating a RESTful API for task management using Node.js and Express.js. It includes setting up the project, implementing CRUD operations with in-memory data storage, and adding features like input validation, error handling, filtering, sorting, and task prioritization.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/airtribe-projects/task-manager-api-ks6201
   ```

2. Navigate to the project directory:
   ```bash
   cd task-manager-api-ks6201
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the application:
   - For local development:
     ```bash
     npm run start
     ```
   - For deployment (using pm2):
     ```bash
     pm2 start app.js --name "task-manager-api"
     ```

## Optional: Run Tests

1. To run tests, use:
   ```bash
   npm run test
   ```


## API Documentation

### GET `/tasks`

**Description:**  
Retrieves a list of tasks.

**Route:**
```js
taskRoute.get("/", queryValidate(getAllTaskQuerySchema), getAllTasksController);
```

**Request Query Parameters:**

- **completed** (optional): Filters tasks based on their completion status.
  - **Type**: `boolean`  
  - **Values**:
    - `true`: Returns only completed tasks.
    - `false`: Returns only tasks that are not completed.
  - **Default**: If not provided, returns all tasks regardless of their completion status.

**Response:**
- **200 OK**: Returns a list of tasks with pagination information.

Example response:
```json
[
    {
        "id": 16,
        "priority": "low",
        "createdAt": 1740591869964,
        "title": "Create a new project",
        "description": "Create a new project using Magic4",
        "completed": false
    },
    {
        "id": 17,
        "priority": "high",
        "createdAt": 1740591869970,
        "title": "Create a new project 2",
        "description": "Create a new project using Magic 5",
        "completed": false
    }
]
```

**Middleware:**
- `queryValidate`: Validates the query parameters based on the `getAllTaskQuerySchema` validation schema.

**Controller:**
- `getAllTasksController`: Handles the request and returns the task data.

**Test:**
```js
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
```

---

### GET `/tasks/:id`

**Description:**  
Retrieves a task by its ID.

**Route:**
```js
taskRoute.get("/:id", paramsValidate(taskIdSchema), getTaskByIdController);
```

**Request Path Parameters:**

- **id** (required): The unique identifier of the task.
  - **Type**: `number`
  - **Validation**:
    - Must be a valid number.
    - Must be greater than 0.
    - Is required.

**Response:**
- **200 OK**: Returns the task data if the task with the provided ID is found.

Example response:
```json
{
    "id": 16,
    "priority": "low",
    "createdAt": 1740591869964,
    "title": "Create a new project",
    "description": "Create a new project using Magic4",
    "completed": false
}
```

- **404 Not Found**: Returns an error if the task with the provided ID does not exist.
Example response:
```json
"Task with id '16' not found."
```

**Middleware:**
- `paramsValidate`: Validates the `id` parameter based on the `taskIdSchema` validation schema.

**Controller:**
- `getTaskByIdController`: Handles the request and returns the task data by its ID, or an error if the task is not found.

**Test:**
```js
tap.test("GET /tasks/:id", async (t) => {
  const response = await server.get("/tasks/1");
  t.equal(response.status, 200);
  t.hasOwnProp(response.body, "id");
  t.hasOwnProp(response.body, "title");
  t.equal(response.body.id, 1, "ID should be 1");
  t.end();
});

tap.test("GET /tasks/:id - invalid ID", async (t) => {
  const response = await server.get("/tasks/999");
  t.equal(response.status, 404);
  t.match(response.text, "Task with id '999' not found.");
  t.end();
});
```

---

### GET `/tasks/priority/:level`

**Description:**  
Retrieves tasks based on their priority level.

**Route:**
```js
taskRoute.get("/priority/:level", paramsValidate(prioritySchema), getTaskByPriority);
```

**Request Path Parameters:**

- **level** (required): The priority level of the tasks to filter by.
  - **Type**: `string`
  - **Validation**:
    - Must be one of the following values: `"low"`, `"medium"`, `"high"`.
    - Is required.

**Response:**
- **200 OK**: Returns a list of tasks that match the specified priority level.

Example response:
```json
[
    {
        "id": 17,
        "priority": "high",
        "createdAt": 1740591869970,
        "title": "Create a new project 2",
        "description": "Create a new project using Magic 5",
        "completed": false
    },
    {
        "id": 18,
        "priority": "high",
        "createdAt": 1740591870001,
        "title": "Urgent Bug Fix",
        "description": "Fix a critical issue in production",
        "completed": true
    }
]
```

- **400 Bad Request**: Returns an error if the `level` parameter does not match any of the allowed priority values.

Example response:
```json
"Priority must be one of low, medium, high"
```

**Middleware:**
- `paramsValidate`: Validates the `level` parameter based on the `prioritySchema` validation schema.

**Controller:**
- `getTaskByPriority`: Handles the request and returns tasks that match the specified priority level.

**Test:**
```js
tap.test("GET /tasks/priority/:level", async (t) => {
  const response = await server.get("/tasks/priority/high");
  t.equal(response.status, 200);
  response.body.forEach(task => {
    t.equal(task.priority, "high", "Task should have high priority");
  });
  t.end();
});

tap.test("GET /tasks/priority/:level - invalid level", async (t) => {
  const response = await server.get("/tasks/priority/invalid");
  t.equal(response.status, 400);
  t.match(response.text, "Priority must be one of low, medium, high");
  t.end();
});
```

---

### POST `/tasks`

**Description:**  
Creates a new task.

**Route:**
```js
taskRoute.post("/", validateTaskSchema, createNewTaskController);
```

**Request Body Parameters:**

- **title** (required): The title of the task.
  - **Type**: `string`
  - **Validation**: Must be provided and non-empty.

- **description** (required): A description of the task.
  - **Type**: `string`
  - **Validation**: Must be provided and non-empty.

- **completed** (required): The completion status of the task.
  - **Type**: `boolean`
  - **Validation**: Must be a boolean (`true` or `false`).

- **priority** (optional): The priority level of the task.
  - **Type**: `string`
  - **Validation**: Must be one of `"low"`, `"medium"`, or `"high"`.
  - **Default**: `"low"` if not provided.

**Response:**
- **201 Created**: Confirms the task was created successfully and returns the task ID.

Example response:
```json
"Task created successfully with Id: 18."
```

**400 Bad Request**: Returns an error if the request body is invalid (e.g., missing required fields or invalid data).

Example response:
```json
"Date must be in the format dd/mm/yyyy"
```

**Middleware:**
- `validateTaskSchema`: Validates the request body against the `taskSchema` validation schema.

**Controller:**
- `createNewTaskController`: Handles the request and creates a new task with the provided data.

**Test:**
```js
tap.test("POST /tasks", async (t) => {
  const newTask = {
    title: "Test Task",
    description: "Testing",
    completed: false,
    priority: "medium",
  };
  const response = await server.post("/tasks").send(newTask);
  t.equal(response.status, 201);
  t.match(response.text, /Task created successfully with Id:/);
  t.end();
});

tap.test("POST /tasks - invalid data", async (t) => {
  const invalidTask = { title: "Invalid" };
  const response = await server.post("/tasks").send(invalidTask);
  t.equal(response.status, 400);
  t.end();
});
```

---

### PUT `/tasks/:id`

**Description:**  
Updates a task by its ID.

**Route:**
```js
taskRoute.put(
    "/:id", 
    paramsValidate(taskIdSchema), 
    validateTaskSchema, 
    updateTaskByIdController
);
```

**Request Path Parameters:**

- **id** (required): The unique identifier of the task to be updated.
  - **Type**: `number`
  - **Validation**:
    - Must be a valid number.
    - Must be greater than 0.
    - Is required.

**Request Body Parameters:**

- **title** (required): The title of the task.
  - **Type**: `string`
  - **Validation**: Must be provided and non-empty.

- **description** (required): A description of the task.
  - **Type**: `string`
  - **Validation**: Must be provided and non-empty.

- **completed** (required): The completion status of the task.
  - **Type**: `boolean`
  - **Validation**: Must be a boolean (`true` or `false`).

- **priority** (optional): The priority level of the task.
  - **Type**: `string`
  - **Validation**: Must be one of `"low"`, `"medium"`, or `"high"`.
  - **Default**: `"low"` if not provided.

**Response:**
- **200 OK**: Confirms that the task has been successfully updated.

Example response:
```json
"Task updated having id 16"
```

- **404 Not Found**: Returns an error if the task with the provided ID does not exist.

Example response:
```json
"Task with id '16' not found."
```

**Middleware:**
- `paramsValidate`: Validates the `id` parameter based on the `taskIdSchema` validation schema.
- `validateTaskSchema`: Validates the request body against the `taskSchema` validation schema.

**Controller:**
- `updateTaskByIdController`: Handles the request to update the task with the specified ID.

**Test:**
```js
tap.test("PUT /tasks/:id", async (t) => {
  const updatedTask = {
    title: "Updated Task",
    description: "Updated Task Desc",
    completed: true,
    priority: "low",
  };
  const response = await server.put("/tasks/1").send(updatedTask);
  t.equal(response.status, 200);
  t.match(response.text, /Task updated having id 1/);
  t.end();
});

tap.test("PUT /tasks/:id - invalid ID", async (t) => {
  const response = await server.put("/tasks/999").send({ title: "Invalid" });
  t.equal(response.status, 404);
  t.match(response.text, "Task with id '999' not found.");
  t.end();
});
```

---

### DELETE `/tasks/:id`

**Description:**  
Deletes a task by its ID.

**Route:**
```js
taskRoute.delete("/:id", paramsValidate(taskIdSchema), deleteTaskByIdController);
```

**Request Path Parameters:**

- **id** (required): The unique identifier of the task to be deleted.
  - **Type**: `number`
  - **Validation**:
    - Must be a valid number.
    - Must be greater than 0.
    - Is required.

**Response:**
- **200 OK**: Confirms that the task has been successfully deleted.

Example response:
```json
"Task deleted having id 16"
```

- **404 Not Found**: Returns an error if the task with the provided ID does not exist.

Example response:
```json
"Task with id '16' not found."
```

**Middleware:**
- `paramsValidate`: Validates the `id` parameter based on the `taskIdSchema` validation schema.

**Controller:**
- `deleteTaskByIdController`: Handles the request to delete the task with the specified ID.

**Test:**
```js
tap.test("DELETE /tasks/:id", async (t) => {
  const response = await server.delete("/tasks/1");
  t.equal(response.status, 200);
  t.match(response.text, "Task deleted having id 1");
  t.end();
});

tap.test("DELETE /tasks/:id - invalid ID", async (t) => {
  const response = await server.delete("/tasks/999");
  t.equal(response.status, 404);
  t.match(response.text, "Task with id '999' not found.");
  t.end();
});
```