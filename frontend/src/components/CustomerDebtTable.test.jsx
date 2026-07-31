import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { amountFormatter } from '../formatters.js'
import CustomerDebtTable from './CustomerDebtTable.jsx'

describe('CustomerDebtTable', () => {
  it('shows a loading state while customers are being fetched', () => {
    render(<CustomerDebtTable customers={null} error={null} onRetry={() => {}} />)

    expect(screen.getByRole('heading', { name: 'Customers with balance due' })).toBeInTheDocument()
    expect(screen.getByText('Loading customers...')).toBeInTheDocument()
    expect(screen.queryByText(/customers$/)).not.toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('shows the error and passes retry actions through to LoadError', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(
      <CustomerDebtTable
        customers={null}
        error="Customer balances could not be loaded."
        onRetry={onRetry}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Customer balances could not be loaded.')
    expect(screen.queryByText('Loading customers...')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Retry' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('shows the empty state and a zero count when no customer owes a balance', () => {
    render(<CustomerDebtTable customers={[]} error={null} onRetry={() => {}} />)

    expect(screen.getByText('0 customers')).toBeInTheDocument()
    expect(screen.getByText('All clear')).toBeInTheDocument()
    expect(screen.getByText('No customers have a balance due.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renders customer balances and filters them by search', async () => {
    const user = userEvent.setup()
    const customers = [
      {
        id: 'customer-1',
        number: '1001',
        displayName: 'Northwind AB',
        email: 'accounts@northwind.test',
        balanceDue: 1234.5,
        currencyCode: 'SEK',
      },
      {
        id: 'customer-2',
        number: '1002',
        displayName: 'Contoso AB',
        email: '',
        balanceDue: 75,
        currencyCode: null,
      },
    ]

    render(<CustomerDebtTable customers={customers} error={null} onRetry={() => {}} />)

    expect(screen.getByText('2 customers')).toBeInTheDocument()

    const region = screen.getByRole('region', { name: 'Customers with balance due' })
    expect(region).toHaveAttribute('tabindex', '0')

    const rows = within(region).getAllByRole('row')
    expect(rows).toHaveLength(3)
    expect(within(rows[0]).getAllByRole('columnheader').map((cell) => cell.textContent)).toEqual([
      'Number',
      'Customer',
      'Email',
      'Balance due, SEK',
      'Currency',
    ])
    expect(within(rows[1]).getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      '1001',
      'Northwind AB',
      'accounts@northwind.test',
      amountFormatter.format(1234.5),
      'SEK',
    ])
    expect(within(rows[2]).getAllByRole('cell').map((cell) => cell.textContent)).toEqual([
      '1002',
      'Contoso AB',
      '-',
      amountFormatter.format(75),
      '-',
    ])

    await user.type(screen.getByRole('searchbox', { name: 'Search' }), 'northwind')
    expect(screen.getByText('1 / 2 customers')).toBeInTheDocument()
    expect(screen.getByText('Northwind AB')).toBeInTheDocument()
    expect(screen.queryByText('Contoso AB')).not.toBeInTheDocument()
  })
})
