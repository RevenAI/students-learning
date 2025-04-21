import { useState, useEffect } from "react"
import axios from "axios"
import ListComponent from "./ListComponent"
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from "./ErrorMessage"
import EmptyMessage from "./EmptyMessage"
import "./UsersList.css"

function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get("https://jsonplaceholder.typicode.com/users")
        setUsers(response.data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch users. Please try again later.")
        console.error("Error fetching users:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    // Re-fetch data
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        setUsers(response.data)
      })
      .catch((err) => {
        setError("Failed to fetch users. Please try again later.")
        console.error("Error fetching users:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Custom render function for user items
  const renderUser = (user) => (
    <div className="user-card">
      <div className="user-header">
        <div className="user-avatar">{user.name.charAt(0)}</div>
        <h3>{user.name}</h3>
      </div>
      <div className="user-details">
        <p>
          <strong>Username:</strong> {user.username}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone}
        </p>
        <p>
          <strong>Website:</strong> {user.website}
        </p>
        <p>
          <strong>Company:</strong> {user.company.name}
        </p>
        <p>
          <strong>Address:</strong> {user.address.street}, {user.address.suite}, {user.address.city},{" "}
          {user.address.zipcode}
        </p>
      </div>
    </div>
  )

  if (loading) {
    return <LoadingSpinner message="Loading users..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />
  }

  return (
    <div className="users-container">
      <h2>Users</h2>
      <ListComponent
        items={users}
        renderItem={renderUser}
        keyExtractor={(user) => user.id.toString()}
        listClassName="users-list"
        itemClassName="user-item"
        emptyComponent={<EmptyMessage message="No users found." />}
      />
    </div>
  )
}

export default UsersList
