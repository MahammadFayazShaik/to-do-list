// src/redux/todoSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../firebase';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const initialState = {
  todos: [],
  loading: false,
  error: null
};

// Get todos from Firestore
export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const snapshot = await getDocs(collection(db, 'todos'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

// Add todo to Firestore
export const addTodo = createAsyncThunk('todos/addTodo', async (task) => {
  const newTodo = { text: task, completed: false };
  const docRef = await addDoc(collection(db, 'todos'), newTodo);
  return { id: docRef.id, ...newTodo };
});

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
      });
  },
});

export default todoSlice.reducer;
