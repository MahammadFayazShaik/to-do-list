  // src/App.js
  import React from 'react';
  import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
  import { Provider } from 'react-redux';
  import store from './redux/store';
  import Register from './pages/Register';
  import Login from './pages/Login';
  import TodoPage from './pages/TodoPage';

  function App() {
    return (
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/todos" element={<TodoPage />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </Provider>
    );
  }

  export default App;
