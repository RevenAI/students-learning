import { useState, useEffect } from "react"
import axios from "axios"
import ListComponent from "./ListComponent"
import LoadingSpinner from "./LoadingSpinner"
import ErrorMessage from "./ErrorMessage"
import EmptyMessage from "./EmptyMessage"
import "./PostsList.css"

function PostsList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        // Limiting to 20 posts for better performance
        const response = await axios.get("https://jsonplaceholder.typicode.com/posts?_limit=20")
        setPosts(response.data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch posts. Please try again later.")
        console.error("Error fetching posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleRetry = () => {
    setLoading(true)
    setError(null)
    // Re-fetch data
    axios
      .get("https://jsonplaceholder.typicode.com/posts?_limit=20")
      .then((response) => {
        setPosts(response.data)
      })
      .catch((err) => {
        setError("Failed to fetch posts. Please try again later.")
        console.error("Error fetching posts:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Custom render function for post items
  const renderPost = (post) => (
    <div className="post-card">
      <h3 className="post-title">{post.title}</h3>
      <p className="post-body">{post.body}</p>
      <div className="post-footer">
        <span className="post-user-id">User ID: {post.userId}</span>
        <span className="post-id">Post #{post.id}</span>
      </div>
    </div>
  )

  if (loading) {
    return <LoadingSpinner message="Loading posts..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />
  }

  return (
    <div className="posts-container">
      <h2>Posts</h2>
      <ListComponent
        items={posts}
        renderItem={renderPost}
        keyExtractor={(post) => post.id.toString()}
        listClassName="posts-list"
        itemClassName="post-item"
        emptyComponent={<EmptyMessage message="No posts found." />}
      />
    </div>
  )
}

export default PostsList
