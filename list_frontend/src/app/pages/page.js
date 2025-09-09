"use client"; // MUST be at the top

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // Fetch todos on page load
  useEffect(() => {
    fetch("http://localhost:3000/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.error("Failed to fetch todos:", err));
  }, []);

  // Function to create a new todo
  const addTodo = async (e) => {
    e.preventDefault();

    if (!newTodo.trim()) return;

    try {
      const res = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: { title: newTodo } }),
      });

      if (!res.ok) throw new Error("Failed to create todo");

      const createdTodo = await res.json();
      setTodos([...todos, createdTodo]);
      setNewTodo("");
    } catch (err) {
      console.error(err);
    }
  };

  // Function to delete a todo
  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      // remove deleted todo from state
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Todos</h1>

      {/* Form to add new todo */}
      <form onSubmit={addTodo} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          style={{ padding: "5px", marginRight: "10px" }}
        />
        <button type="submit">Add Todo</button>
      </form>

      {/* List of todos */}
      <ul>
        {todos.map((todo) => (
          <div style={{display: "flex"}}>
                    <li key={todo.id} style={{ margin: "8px" }}> {todo.id}{" "} </li>

          <li key={todo.id} style={{ marginBottom: "8px" }}>
            
            {todo.title}{" "}
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ marginLeft: "10px", color: "red" }}
            >
              Delete
            </button>
          </li>
                    </div>

        ))}
      </ul>
    </div>
  );
}
