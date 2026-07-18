import { amountFormatter } from '../formatters.js'
import LoadError from './LoadError.jsx'

export function CustomerKpiSection({ customerKpi, error, onRetry }) {
  return (
    <section>
      <h2>Customer KPI</h2>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : customerKpi === null ? (
        <p>Loading customer KPI...</p>
      ) : (
        <>
          <p>Customers: {customerKpi.customersCount}</p>
          <p>Customers with balance due: {customerKpi.customersWithBalanceDueCount}</p>
          <p>Total balance due: {amountFormatter.format(customerKpi.totalBalanceDue)}</p>
          <p>Average balance due: {amountFormatter.format(customerKpi.averageBalanceDue)}</p>
          <p>Largest balance due: {amountFormatter.format(customerKpi.largestBalanceDue)}</p>
        </>
      )}
    </section>
  )
}

export function SalesInvoiceKpiSection({ salesInvoiceKpi, error, onRetry }) {
  return (
    <section>
      <h2>Sales invoice KPI</h2>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : salesInvoiceKpi === null ? (
        <p>Loading sales invoice KPI...</p>
      ) : (
        <>
          <p>Invoices: {salesInvoiceKpi.invoicesCount}</p>
          <p>Open invoices: {salesInvoiceKpi.openInvoicesCount}</p>
          <p>Remaining amount: {amountFormatter.format(salesInvoiceKpi.totalRemainingAmount)}</p>
          <p>
            Total excluding tax:{' '}
            {amountFormatter.format(salesInvoiceKpi.totalAmountExcludingTax)}
          </p>
          <p>Total tax: {amountFormatter.format(salesInvoiceKpi.totalTaxAmount)}</p>
          <p>
            Total including tax: {amountFormatter.format(salesInvoiceKpi.totalAmountIncludingTax)}
          </p>
        </>
      )}
    </section>
  )
}

export function PostedSalesInvoiceKpiSection({ postedSalesInvoiceKpi, error, onRetry }) {
  return (
    <section>
      <h2>Posted sales invoice KPI</h2>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : postedSalesInvoiceKpi === null ? (
        <p>Loading posted sales invoice KPI...</p>
      ) : (
        <>
          <p>Posted invoices: {postedSalesInvoiceKpi.postedInvoicesCount}</p>
          <p>
            Total excluding tax:{' '}
            {amountFormatter.format(postedSalesInvoiceKpi.totalAmountExcludingTax)}
          </p>
          <p>Total tax: {amountFormatter.format(postedSalesInvoiceKpi.totalTaxAmount)}</p>
          <p>
            Total including tax:{' '}
            {amountFormatter.format(postedSalesInvoiceKpi.totalAmountIncludingTax)}
          </p>
        </>
      )}
    </section>
  )
}
