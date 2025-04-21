import { useState, useEffect } from "react"
import axios from "axios"
import ListComponent from "./ListComponent"
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from "./ErrorMessage"
import EmptyMessage from "./EmptyMessage"
import "./TodosList.css"

function TodosList() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all") // "all", "completed", "incomplete"

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true)
        // Limiting to 30 todos for better performance
        const response = await axios.get("https://jsonplaceholder.typicode.com/todos?_limit=30")
        setTodos(response.data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch todos. Please try again later.")
        console.error("Error fetching todos:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTodos()
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    // Re-fetch data
    axios
      .get("https://jsonplaceholder.typicode.com/todos?_limit=30")
      .then((response) => {
        setTodos(response.data)
      })
      .catch((err) => {
        setError("Failed to fetch todos. Please try again later.")
        console.error("Error fetching todos:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Filter todos based on completion status
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true
    if (filter === "completed") return todo.completed
    if (filter === "incomplete") return !todo.completed
    return true
  })

  // Custom render function for todo items
  const renderTodo = (todo) => (
    <div className={`todo-card ${todo.completed ? "completed" : ""}`}>
      <div className="todo-checkbox">
        <input type="checkbox" checked={todo.completed} readOnly id={`todo-${todo.id}`} />
        <label htmlFor={`todo-${todo.id}`}></label>
      </div>
      <div className="todo-content">
        <p className="todo-title">{todo.title}</p>
        <span className="todo-user">User ID: {todo.userId}</span>
      </div>
    </div>
  )

  if (loading) {
    return <LoadingSpinner message="Loading todos..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />
  }

  return (
    <div className="todos-container">
      <div className="todos-header">
        <h2>Todos</h2>
        <div className="todos-filter">
          <button className={`filter-button ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            All
          </button>
          <button
            className={`filter-button ${filter === "completed" ? "active" : ""}`}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
          <button
            className={`filter-button ${filter === "incomplete" ? "active" : ""}`}
            onClick={() => setFilter("incomplete")}
          >
            Incomplete
          </button>
        </div>
      </div>

      <ListComponent
        items={filteredTodos}
        renderItem={renderTodo}
        keyExtractor={(todo) => todo.id.toString()}
        listClassName="todos-list"
        itemClassName="todo-item"
        emptyComponent={<EmptyMessage message={`No ${filter} todos found.`} />}
      />
    </div>
  )
}

export default TodosList
