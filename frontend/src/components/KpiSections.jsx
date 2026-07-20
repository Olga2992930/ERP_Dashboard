import { amountFormatter } from '../formatters.js'
import LoadError from './LoadError.jsx'

function KpiCard({ label, value }) {
  return (
    <div className="kpi-card">
      <span className="kpi-label">{label}</span>
      <strong className="kpi-value">{value}</strong>
    </div>
  )
}

export function CustomerKpiSection({ customerKpi, error, onRetry }) {
  return (
    <section>
      <h2>Customer KPI</h2>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : customerKpi === null ? (
        <p>Loading customer KPI...</p>
      ) : (
        <div className="kpi-list">
          <KpiCard label="Customers" value={customerKpi.customersCount} />
          <KpiCard
            label="Customers with balance due"
            value={customerKpi.customersWithBalanceDueCount}
          />
          <KpiCard
            label="Total balance due"
            value={amountFormatter.format(customerKpi.totalBalanceDue)}
          />
          <KpiCard
            label="Average balance due"
            value={amountFormatter.format(customerKpi.averageBalanceDue)}
          />
          <KpiCard
            label="Largest balance due"
            value={amountFormatter.format(customerKpi.largestBalanceDue)}
          />
        </div>
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
        <div className="kpi-list">
          <KpiCard label="Invoices" value={salesInvoiceKpi.invoicesCount} />
          <KpiCard label="Open invoices" value={salesInvoiceKpi.openInvoicesCount} />
          <KpiCard
            label="Remaining amount"
            value={amountFormatter.format(salesInvoiceKpi.totalRemainingAmount)}
          />
          <KpiCard
            label="Total excluding tax"
            value={amountFormatter.format(salesInvoiceKpi.totalAmountExcludingTax)}
          />
          <KpiCard
            label="Total tax"
            value={amountFormatter.format(salesInvoiceKpi.totalTaxAmount)}
          />
          <KpiCard
            label="Total including tax"
            value={amountFormatter.format(salesInvoiceKpi.totalAmountIncludingTax)}
          />
        </div>
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
        <div className="kpi-list">
          <KpiCard label="Posted invoices" value={postedSalesInvoiceKpi.postedInvoicesCount} />
          <KpiCard
            label="Total excluding tax"
            value={amountFormatter.format(postedSalesInvoiceKpi.totalAmountExcludingTax)}
          />
          <KpiCard
            label="Total tax"
            value={amountFormatter.format(postedSalesInvoiceKpi.totalTaxAmount)}
          />
          <KpiCard
            label="Total including tax"
            value={amountFormatter.format(postedSalesInvoiceKpi.totalAmountIncludingTax)}
          />
        </div>
      )}
    </section>
  )
}
