import LoadError from './LoadError.jsx'

function CurrentUserSection({ currentUser, error, onRetry }) {
  return (
    <section>
      <h2>Current user</h2>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : currentUser === null ? (
        <p>Loading user...</p>
      ) : (
        <>
          <p>Name: {currentUser.name}</p>
          <p>Email: {currentUser.email}</p>
        </>
      )}
    </section>
  )
}

export default CurrentUserSection
