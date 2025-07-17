import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { FiCheckCircle, FiFilter } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TodoPage.css";

const TodoPage = () => {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        fetchTodos(firebaseUser.uid);
      } else {
        setUser(null);
        setTodos([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTodos = async (uid) => {
    const q = query(collection(db, "todos"), where("uid", "==", uid));
    onSnapshot(q, (snapshot) => {
      const fetchedTodos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setTodos(fetchedTodos);
    });
  };

  const addTodo = async () => {
    if (!task.trim() || !user) return;

    await addDoc(collection(db, "todos"), {
      text: task.trim(),
      completed: false,
      uid: user.uid,
      createdAt: new Date(),
    });

    setTask("");
  };

  const toggleComplete = async (id, completed) => {
    const todoRef = doc(db, "todos", id);
    await updateDoc(todoRef, {
      completed: !completed,
    });
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, "todos", id));
  };

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const filteredTodos = todos.filter((todo) => {
    const matchFilter =
      (filter === "active" && !todo.completed) ||
      (filter === "completed" && todo.completed) ||
      filter === "all";

    const matchDate = selectedDate
      ? isSameDate(new Date(todo.createdAt), selectedDate)
      : true;

    return matchFilter && matchDate;
  });

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="todo-container">
     <div className="top-right-logout">
  <button className="logout-button">
    <a href="/" className="logout-link">LogOut</a>
  </button>
</div>


      <h1 className="todo-title">My Todo List</h1>
      <p className="todo-subtitle">Stay organized and productive</p>

      <div className="todo-input-box">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="todo-input"
        />
        <button onClick={addTodo} className="todo-add-btn">
          + Add
        </button>
      </div>

      <div className="todo-date-picker">
        <label className="todo-date-label">Filter by Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          placeholderText="Select a date"
          className="todo-input"
          isClearable
        />
      </div>

      <div className="todo-header-row">
  <div className="todo-stats">
    <span className="todo-pill">{activeCount} active</span>
    <span className="todo-pill">{completedCount} completed</span>
    <span className="todo-pill">{totalCount} total</span>
  </div>

  <div className="todo-filters">
    {["all", "active", "completed"].map((f) => (
      <button
        key={f}
        onClick={() => setFilter(f)}
        className={`todo-filter-btn ${filter === f ? "active" : ""}`}
      >
        <FiFilter />
        {f.charAt(0).toUpperCase() + f.slice(1)}
      </button>
    ))}
  </div>
</div>

      <div className="todo-list">
        {filteredTodos.length > 0 ? (
          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <label className="todo-checkbox-label">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id, todo.completed)}
                    className="todo-checkbox"
                  />
                  <span className={`todo-text ${todo.completed ? "completed" : ""}`}>
                    {todo.text}
                  </span>
                </label>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="todo-delete"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="todo-empty">
            <FiCheckCircle className="todo-empty-icon" />
            <p className="todo-empty-title">No todos yet</p>
            <p className="todo-empty-desc">
              Add your first task above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoPage;
