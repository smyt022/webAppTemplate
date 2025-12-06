import React, { useState, useEffect } from 'react';
import './TodoList.css';
import { getToken, getAuthHeaders } from '../utils/auth';

function TodoList({ onLogout, apiUrl }) {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`${apiUrl}/todos/`, {
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else if (response.status === 401) {
        onLogout();
      }
    } catch (err) {
      setError('Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(`${apiUrl}/todos/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: newTodo.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setTodos([data, ...todos]);
        setNewTodo('');
      } else {
        setError('Failed to add todo');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/todos/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      } else {
        setError('Failed to delete todo');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (loading) {
    return (
      <div className="todo-container">
        <div className="todo-card">
          <div className="loading">Loading todos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-container">
      <div className="todo-card">
        <div className="todo-header">
          <h1>My Todos</h1>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
          />
          <button type="submit" className="add-button">
            Add
          </button>
        </form>

        <div className="todos-list">
          {todos.length === 0 ? (
            <p className="empty-message">No todos yet. Add one above!</p>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="todo-item">
                <span className="todo-title">{todo.title}</span>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoList;

