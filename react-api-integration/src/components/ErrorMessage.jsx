

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <p>{message}</p>
      {onRetry && <button onClick={onRetry}>Try Again</button>}
    </div>
  )
}

export default ErrorMessage
