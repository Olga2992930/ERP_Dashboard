function LoadError({ message, onRetry, compact = false }) {
  return (
    <div className={`error-state${compact ? ' error-state--compact' : ''}`} role="alert">
      <p>{message}</p>
      <button className="button button--retry" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

export default LoadError
