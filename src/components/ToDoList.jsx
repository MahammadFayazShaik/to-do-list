import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import Logout from '../components/Logout';
import { useNavigate } from 'react-router-dom';

const TodoPage = () => {
  const [input, setInput] = useState('');
  const [todos, setTodos] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const q = query(collection(db, 'todos'), where('uid', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setTodos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, [user, navigate]);

 const addTodo = async (e) => {
  e.preventDefault();
  const trimmedInput = input.trim();
  if (!trimmedInput || !user) {
    console.log("No input or user missing");
    return;
  }

  console.log("Trying to add:", {
    text: trimmedInput,
    completed: false,
    uid: user.uid
  });

  try {
    const docRef = await addDoc(collection(db, 'todos'), {
      text: trimmedInput,
      completed: false,
      uid: user.uid,
    });
    console.log("Todo added with ID:", docRef.id);
    setInput('');
  } catch (error) {
    console.error("🔥 Error adding todo:", error.message);
    alert("Error adding todo: " + error.message);
  }
};


  const toggleTodo = async (id, current) => {
    try {
      await updateDoc(doc(db, 'todos', id), {
        completed: !current,
      });
    } catch (error) {
      console.error('Error updating todo:', error.message);
      alert('Failed to update todo.');
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      console.error('Error deleting todo:', error.message);
      alert('Failed to delete todo.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h2>Your To-Do List</h2>
      <Logout />
      <form onSubmit={addTodo} style={{ marginBottom: '1rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New Task"
          style={{ padding: '0.5rem', width: '70%' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem' }}>
          Add
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} style={{ marginBottom: '0.5rem' }}>
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                cursor: 'pointer',
                marginRight: '1rem',
              }}
              onClick={() => toggleTodo(todo.id, todo.completed)}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoPage;
