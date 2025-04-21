import { useState } from "react"
import Header from "./components/Header"
import UsersList from "./components/UsersList"
import PostsList from "./components/PostsList"
import TodosList from "./components/TodosList"
import "./App.css"

function App() {
  // State to track which data type to display
  const [activeTab, setActiveTab] = useState("users")

  // Function to handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }

  return (
    <div className="app">
      <Header />

      <main className="container">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === "users" ? "active" : ""}`}
            onClick={() => handleTabChange("users")}
          >
            Users
          </button>
          <button
            className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => handleTabChange("posts")}
          >
            Posts
          </button>
          <button
            className={`tab-button ${activeTab === "todos" ? "active" : ""}`}
            onClick={() => handleTabChange("todos")}
          >
            Todos
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "users" && <UsersList />}
          {activeTab === "posts" && <PostsList />}
          {activeTab === "todos" && <TodosList />}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>JSONPlaceholder API Demo - React Mini Project</p>
        </div>
      </footer>
    </div>
  )
}

export default App
