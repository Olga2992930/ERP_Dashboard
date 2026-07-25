import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  CustomerKpiSection,
  PostedSalesInvoiceKpiSection,
  SalesInvoiceKpiSection,
  SummaryKpiRow,
} from './KpiSections.jsx'

const customerKpi = {
  customersCount: 4,
  customersWithBalanceDueCount: 3,
  totalBalanceDue: 625.5,
  averageBalanceDue: 156.375,
  largestBalanceDue: 250,
}

const customers = [
  {
    id: 'customer-1',
    number: 'C-001',
    displayName: 'Alice Andersson',
    email: 'alice@example.com',
    balanceDue: 125.5,
    creditLimit: 1000,
  },
  {
    id: 'customer-2',
    number: 'C-002',
    displayName: 'Bob Paid',
    email: 'bob@example.com',
    balanceDue: 0,
    creditLimit: 500,
  },
  {
    id: 'customer-3',
    number: 'C-003',
    displayName: 'Carla Capital',
    email: '',
    balanceDue: 250,
    creditLimit: 2000,
  },
  {
    id: 'customer-4',
    number: 'C-004',
    displayName: 'Daniel Debt',
    email: 'daniel@example.com',
    balanceDue: 250,
    creditLimit: 1500,
  },
]

const salesInvoiceKpi = {
  invoicesCount: 3,
  openInvoicesCount: 1,
  totalRemainingAmount: 325,
  totalAmountExcludingTax: 1200,
  totalTaxAmount: 300,
  totalAmountIncludingTax: 1500,
}

const invoices = [
  {
    id: 'invoice-1',
    number: 'INV-001',
    customerName: 'Alice Andersson',
    invoiceDate: '2026-07-01',
    dueDate: '2026-07-31',
    remainingAmount: 325,
    totalAmountIncludingTax: 500,
  },
  {
    id: 'invoice-2',
    number: 'INV-002',
    customerName: 'Bob Paid',
    invoiceDate: '2026-06-01',
    dueDate: '2026-06-30',
    remainingAmount: 0,
    totalAmountIncludingTax: 750,
  },
  {
    id: 'invoice-3',
    number: 'INV-003',
    customerName: 'Carla Capital',
    invoiceDate: null,
    dueDate: null,
    remainingAmount: null,
    totalAmountIncludingTax: 250,
  },
]

const originalScrollIntoView = Element.prototype.scrollIntoView

afterEach(cleanup)

beforeAll(() => {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  })
})

afterAll(() => {
  if (originalScrollIntoView) {
    Object.defineProperty(Element.prototype, 'scrollIntoView', {
      configurable: true,
      value: originalScrollIntoView,
    })
  } else {
    delete Element.prototype.scrollIntoView
  }
})

function customerProps(overrides = {}) {
  return {
    customerKpi,
    error: null,
    onRetry: vi.fn(),
    records: customers,
    recordsError: null,
    onRetryRecords: vi.fn(),
    ...overrides,
  }
}

function salesInvoiceProps(overrides = {}) {
  return {
    salesInvoiceKpi,
    error: null,
    onRetry: vi.fn(),
    records: invoices,
    recordsError: null,
    onRetryRecords: vi.fn(),
    ...overrides,
  }
}

describe('SummaryKpiRow', () => {
  it('shows the available summary values and selects the requested dashboard section', async () => {
    const user = userEvent.setup()
    const onSelectSection = vi.fn()

    render(
      <SummaryKpiRow
        customerKpi={customerKpi}
        salesInvoiceKpi={salesInvoiceKpi}
        postedSalesInvoiceKpi={null}
        onSelectSection={onSelectSection}
      />,
    )

    expect(screen.getByRole('region', { name: 'Key business indicators' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open Customers section' })).toHaveTextContent('4')
    expect(screen.getByRole('button', { name: 'Open Posted invoices section' })).toHaveTextContent('—')

    await user.click(screen.getByRole('button', { name: 'Open Balance due section' }))

    expect(onSelectSection).toHaveBeenCalledOnce()
    expect(onSelectSection).toHaveBeenCalledWith('receivables')
  })
})

describe('CustomerKpiSection', () => {
  it('renders loading and error states and retries the KPI request', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const { rerender } = render(
      <CustomerKpiSection {...customerProps({ customerKpi: null, records: null, onRetry })} />,
    )

    expect(screen.getByText('Loading customer KPI...')).toBeInTheDocument()

    rerender(
      <CustomerKpiSection
        {...customerProps({ customerKpi: null, error: 'Customer KPI is unavailable', onRetry })}
      />,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Customer KPI is unavailable')

    await user.click(within(alert).getByRole('button', { name: 'Retry' }))

    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('filters customers with balances, toggles details, and includes all tied largest balances', async () => {
    const user = userEvent.setup()
    render(<CustomerKpiSection {...customerProps()} />)

    const withBalanceButton = screen.getByRole('button', { name: /Customers with balance due/ })
    expect(withBalanceButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(withBalanceButton)

    const balanceRegion = screen.getByRole('region', { name: 'Customers with balance due details' })
    expect(withBalanceButton).toHaveAttribute('aria-expanded', 'true')
    expect(within(balanceRegion).getAllByRole('row')).toHaveLength(4)
    expect(within(balanceRegion).getByText('Alice Andersson')).toBeInTheDocument()
    expect(within(balanceRegion).queryByText('Bob Paid')).not.toBeInTheDocument()

    await user.click(withBalanceButton)

    expect(screen.queryByRole('region', { name: 'Customers with balance due details' })).not.toBeInTheDocument()
    expect(withBalanceButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(screen.getByRole('button', { name: /Largest balance due/ }))

    const largestRegion = screen.getByRole('region', { name: 'Largest balance due details' })
    expect(within(largestRegion).getAllByRole('row')).toHaveLength(3)
    expect(within(largestRegion).getByText('Carla Capital')).toBeInTheDocument()
    expect(within(largestRegion).getByText('Daniel Debt')).toBeInTheDocument()
    expect(within(largestRegion).queryByText('Alice Andersson')).not.toBeInTheDocument()
  })

  it('shows a detail-loading state and retries a failed records request', async () => {
    const user = userEvent.setup()
    const onRetryRecords = vi.fn()
    const { rerender } = render(
      <CustomerKpiSection {...customerProps({ records: null, onRetryRecords })} />,
    )

    await user.click(screen.getByRole('button', { name: /Customers with balance due/ }))
    expect(screen.getByText('Loading details...')).toBeInTheDocument()

    rerender(
      <CustomerKpiSection
        {...customerProps({
          records: null,
          recordsError: 'Customer records could not be loaded',
          onRetryRecords,
        })}
      />,
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Customer records could not be loaded')
    await user.click(within(alert).getByRole('button', { name: 'Retry' }))
    expect(onRetryRecords).toHaveBeenCalledOnce()
  })
})

describe('SalesInvoiceKpiSection', () => {
  it('only shows invoices with a remaining amount for the open-invoices KPI', async () => {
    const user = userEvent.setup()
    render(<SalesInvoiceKpiSection {...salesInvoiceProps()} />)

    await user.click(screen.getByRole('button', { name: /Open invoices/ }))

    const region = screen.getByRole('region', { name: 'Sales invoice details' })
    expect(within(region).getAllByRole('row')).toHaveLength(2)
    expect(within(region).getByText('INV-001')).toBeInTheDocument()
    expect(within(region).queryByText('INV-002')).not.toBeInTheDocument()
    expect(within(region).queryByText('INV-003')).not.toBeInTheDocument()
  })

  it('shows all invoice records for a non-filtering KPI', async () => {
    const user = userEvent.setup()
    render(<SalesInvoiceKpiSection {...salesInvoiceProps()} />)

    await user.click(screen.getByRole('button', { name: /^Invoices/ }))

    const region = screen.getByRole('region', { name: 'Sales invoice details' })
    expect(within(region).getAllByRole('row')).toHaveLength(4)
    expect(within(region).getByText('INV-001')).toBeInTheDocument()
    expect(within(region).getByText('INV-002')).toBeInTheDocument()
    expect(within(region).getByText('INV-003')).toBeInTheDocument()
  })
})

describe('PostedSalesInvoiceKpiSection', () => {
  it('opens a breakdown with the posted invoice records', async () => {
    const user = userEvent.setup()
    render(
      <PostedSalesInvoiceKpiSection
        postedSalesInvoiceKpi={{
          postedInvoicesCount: 3,
          totalAmountExcludingTax: 1200,
          totalTaxAmount: 300,
          totalAmountIncludingTax: 1500,
        }}
        error={null}
        onRetry={vi.fn()}
        records={invoices}
        recordsError={null}
        onRetryRecords={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Posted invoices/ }))

    const region = screen.getByRole('region', { name: 'Posted invoice details' })
    expect(within(region).getAllByRole('row')).toHaveLength(4)
    expect(within(region).getByText('INV-001')).toBeInTheDocument()
  })
})
