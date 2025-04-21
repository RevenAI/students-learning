function EmptyMessage({ message = "No items found." }) {
    return (
      <div className="empty-message">
        <p>{message}</p>
      </div>
    )
  }
  
  export default EmptyMessage
  