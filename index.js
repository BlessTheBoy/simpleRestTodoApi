import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// Routes

// app.get("/", (req, res) => {
//   return "Connected!!!";
// });

// create a todo
// id | title | description | done | created_at | updated_at;
app.post("/todos", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (title, description) VALUES($1, $2) RETURNING *",
      [title, description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

// get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await pool.query("SELECT * FROM todo");
    res.json(todos.rows);
  } catch (error) {
    console.log(error.message);
  }
});

// get a todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE id = $1", [id]);
    res.json(todo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

// update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, done } = req.body;
    let updatedTodo;
    if (title && description && done !== undefined) {
      updatedTodo = await pool.query(
        "UPDATE todo SET title = $1, description = $2, done = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *",
        [title, description, done, id]
      );
    } else if (title && description) {
      updatedTodo = await pool.query(
        "UPDATE todo SET title = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
        [title, description, id]
      );
    } else if (title && done !== undefined) {
      updatedTodo = await pool.query(
        "UPDATE todo SET title = $1, done = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
        [title, done, id]
      );
    } else if (description && done !== undefined) {
      updatedTodo = await pool.query(
        "UPDATE todo SET description = $1, done = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
        [description, done, id]
      );
    } else if (title) {
      updatedTodo = await pool.query(
        "UPDATE todo SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [title, id]
      );
    } else if (description) {
      updatedTodo = await pool.query(
        "UPDATE todo SET description = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [description, id]
      );
    } else if (done !== undefined) {
      updatedTodo = await pool.query(
        "UPDATE todo SET done = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [done, id]
      );
    } else {
      return res.json("No data to update");
    }

    res.json(updatedTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

// delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE id = $1", [id]);
    res.json(true);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(5000, () => {
  console.log("server has started!");
});
