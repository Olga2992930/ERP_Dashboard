import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App.jsx'
import {
  backendUrl,
  customersWithBalanceDue,
} from './test/msw/handlers.js'
import { server } from './test/msw/server.js'

describe('App', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/')
  })

  it('shows the secure login action without loading protected navigation when signed out', async () => {
    server.use(
      http.get(`${backendUrl}/api/auth/status`, () =>
        HttpResponse.json({ authenticated: false }),
      ),
    )

    render(<App />)

    expect(
      await screen.findByRole('button', { name: 'Log in with Google' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Customers, invoice performance and receivables at a glance.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: 'Dashboard navigation' }),
    ).not.toBeInTheDocument()
    expect(screen.queryByText('Welcome back')).not.toBeInTheDocument()
  })

  it('loads an authenticated dashboard and navigates between its sections', async () => {
    const user = userEvent.setup()
    render(<App />)

    const navigation = await screen.findByRole('navigation', {
      name: 'Dashboard navigation',
    })

    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(
      await screen.findByRole('region', { name: 'Key business indicators' }),
    ).toBeInTheDocument()

    await user.click(within(navigation).getByRole('button', { name: 'Customers' }))

    expect(
      await screen.findByRole('heading', { name: 'Customer overview' }),
    ).toBeInTheDocument()
    expect(window.location.hash).toBe('#customers')

    await user.click(within(navigation).getByRole('button', { name: 'Receivables' }))

    expect(
      await screen.findByRole('heading', { name: 'Customers with balance due' }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('region', { name: 'Customers with balance due' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Fjord Trading AB')).toBeInTheDocument()
    expect(window.location.hash).toBe('#receivables')
  })

  it('retries a failed resource and renders the recovered data', async () => {
    const user = userEvent.setup()
    let requestCount = 0

    server.use(
      http.get(`${backendUrl}/api/customers/with-balance-due`, () => {
        requestCount += 1

        if (requestCount === 1) {
          return new HttpResponse(null, { status: 503 })
        }

        return HttpResponse.json(customersWithBalanceDue)
      }),
    )

    render(<App />)

    const navigation = await screen.findByRole('navigation', {
      name: 'Dashboard navigation',
    })
    await user.click(within(navigation).getByRole('button', { name: 'Receivables' }))

    const error = await screen.findByRole('alert')
    expect(error).toHaveTextContent('Could not load customers with balance due.')

    await user.click(within(error).getByRole('button', { name: 'Retry' }))

    expect(await screen.findByText('Fjord Trading AB')).toBeInTheDocument()
    expect(requestCount).toBe(2)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
