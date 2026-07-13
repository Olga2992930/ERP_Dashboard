import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [authenticated, setAuthenticated] = useState(null)

  useEffect(() => {
    fetch('http://localhost:8080/api/auth/status', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => setAuthenticated(data.authenticated))
  }, [])

  return (
    <main>
      <h1>ERP Dashboard</h1>
      <p>Business Central analytics and KPI dashboard</p>

      <p>
        Auth status:{' '}
        {authenticated === null ? 'Checking...' : authenticated ? 'Logged in' : 'Logged out'}
      </p>
    </main>
  )
}

export default App
