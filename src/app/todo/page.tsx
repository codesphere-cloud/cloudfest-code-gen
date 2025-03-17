'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './styles.css'

interface Todo {
  id: number
  text: string
  description: string
  completed: boolean
  group: string
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputText, setInputText] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const [inputGroup, setInputGroup] = useState('')
  const [activeGroup, setActiveGroup] = useState<string>('all')
  const router = useRouter()

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos))
      } catch (e) {
        console.error('Failed to parse todos from localStorage', e)
      }
    }
  }, [])

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (inputText.trim() === '') return
    
    const newTodo: Todo = {
      id: Date.now(),
      text: inputText.trim(),
      description: inputDescription.trim(),
      completed: false,
      group: inputGroup.trim() || 'Uncategorized'
    }
    
    setTodos([...todos, newTodo])
    setInputText('')
    setInputDescription('')
    setInputGroup('')
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const clearCompletedTodos = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const getUniqueGroups = () => {
    const groups = todos.map(todo => todo.group)
    return ['all', ...new Set(groups)]
  }

  const filteredTodos = activeGroup === 'all' 
    ? todos 
    : todos.filter(todo => todo.group === activeGroup)
    
  const activeTodosCount = todos.filter(todo => !todo.completed).length

  return (
    <main className="container">
      <div className="header">
        <h1>Todo App</h1>
        <button 
          className="app-button app-button-danger" 
          style={{ marginTop: '1rem' }}
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </div>

      <div className="todo-form">
        <div className="todo-form-inputs">
          <input
            type="text"
            className="app-input"
            placeholder="Add a new todo..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          />
          <input
            type="text"
            className="app-input"
            placeholder="Description (optional)"
            value={inputDescription}
            onChange={(e) => setInputDescription(e.target.value)}
          />
          <input
            type="text"
            className="app-input"
            placeholder="Group (optional)"
            value={inputGroup}
            onChange={(e) => setInputGroup(e.target.value)}
          />
        </div>
        <button 
          className="app-button"
          onClick={addTodo}
        >
          Add
        </button>
      </div>

      {todos.length > 0 && (
        <>
          <div className="group-tabs">
            {getUniqueGroups().map(group => (
              <button
                key={group}
                className={`group-tab ${activeGroup === group ? 'active' : ''}`}
                onClick={() => setActiveGroup(group)}
              >
                {group.charAt(0).toUpperCase() + group.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="todo-actions">
            <div className="todo-count">
              {activeTodosCount} {activeTodosCount === 1 ? 'item' : 'items'} left
            </div>
            {todos.some(todo => todo.completed) && (
              <button 
                className="app-button app-button-danger"
                onClick={clearCompletedTodos}
              >
                Clear Completed
              </button>
            )}
          </div>
        </>
      )}

      {todos.length > 0 ? (
        <>
          {filteredTodos.length > 0 ? (
            <ul className="todo-list">
              {filteredTodos.map(todo => (
                <li key={todo.id} className="todo-item">
                  <div className="todo-item-content">
                    <div className="todo-item-header">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                      />
                      <span className={todo.completed ? 'todo-item-completed' : ''}>
                        {todo.text}
                      </span>
                      <span className="todo-item-group">{todo.group}</span>
                    </div>
                    {todo.description && (
                      <div className="todo-item-description">
                        {todo.description}
                      </div>
                    )}
                  </div>
                  <button 
                    className="app-button app-button-danger"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="todo-list todo-list-empty">
              <p>No todos in the "{activeGroup}" group. Add a task or select another group.</p>
            </div>
          )}
        </>
      ) : (
        <div className="todo-list todo-list-empty">
          <p>No todos yet. Add a task above to get started!</p>
        </div>
      )}
    </main>
  )
}