import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchFromBackend, getBackendUrl } from './api.js'

describe('fetchFromBackend', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the backend with the session cookie and returns parsed JSON', async () => {
    const payload = [{ id: 'customer-1' }]
    const json = vi.fn().mockResolvedValue(payload)
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json })
    vi.stubGlobal('fetch', fetchMock)

    await expect(fetchFromBackend('/api/customers')).resolves.toEqual(payload)
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8080/api/customers', {
      credentials: 'include',
    })
    expect(json).toHaveBeenCalledOnce()
  })

  it('throws an error containing the response status for failed requests', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))

    await expect(fetchFromBackend('/api/customers')).rejects.toThrow(
      'Request failed with status 503',
    )
  })
})

describe('getBackendUrl', () => {
  it('resolves backend-relative paths to an absolute URL', () => {
    expect(getBackendUrl('/logout')).toBe('http://localhost:8080/logout')
  })
})
