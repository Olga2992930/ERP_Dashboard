const backendUrl = 'http://localhost:8080'

export async function fetchFromBackend(path) {
  const response = await fetch(`${backendUrl}${path}`, { credentials: 'include' })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

export function getBackendUrl(path) {
  return new URL(path, backendUrl).toString()
}
