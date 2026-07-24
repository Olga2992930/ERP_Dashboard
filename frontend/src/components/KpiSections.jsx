import { amountFormatter } from '../formatters.js'
import LoadError from './LoadError.jsx'

function KpiCard({ label, value, tone = 'default' }) {
  return (
    <article className={`kpi-card kpi-card--${tone}`}>
      <span className="kpi-label">{label}</span>
      <strong className="kpi-value">{value}</strong>
    </article>
  )
}

function SummaryCard({ label, value, symbol, tone }) {
  return (
    <article className={`summary-kpi-card summary-kpi-card--${tone}`}>
      <span className="summary-kpi-accent" aria-hidden="true" />
      <span className="summary-kpi-symbol" aria-hidden="true">{symbol}</span>
      <span className="summary-kpi-label">{label}</span>
      <strong className="summary-kpi-value">{value ?? '—'}</strong>
      <small>Business Central</small>
    </article>
  )
}

export function SummaryKpiRow({ customerKpi, salesInvoiceKpi, postedSalesInvoiceKpi }) {
  return (
    <section className="summary-kpis" aria-label="Key business indicators">
      <SummaryCard
        label="Customers"
        value={customerKpi?.customersCount}
        symbol="C"
        tone="purple"
      />
      <SummaryCard
        label="Balance due"
        value={customerKpi ? amountFormatter.format(customerKpi.totalBalanceDue) : null}
        symbol="$"
        tone="cyan"
      />
      <SummaryCard
        label="Open invoices"
        value={salesInvoiceKpi?.openInvoicesCount}
        symbol="I"
        tone="violet"
      />
      <SummaryCard
        label="Posted invoices"
        value={postedSalesInvoiceKpi?.postedInvoicesCount}
        symbol="P"
        tone="blue"
      />
    </section>
  )
}

export function CustomerKpiSection({ customerKpi, error, onRetry }) {
  return (
    <section className="dashboard-section" id="customers">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Customers</span>
          <h2>Customer overview</h2>
          <p>Customer base and outstanding receivables.</p>
        </div>
      </div>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : customerKpi === null ? (
        <p className="loading-copy">Loading customer KPI...</p>
      ) : (
        <div className="kpi-list">
          <KpiCard label="Customers" value={customerKpi.customersCount} tone="primary" />
          <KpiCard
            label="Customers with balance due"
            value={customerKpi.customersWithBalanceDueCount}
            tone="attention"
          />
          <KpiCard
            label="Total balance due"
            value={amountFormatter.format(customerKpi.totalBalanceDue)}
            tone="attention"
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
    <section className="dashboard-section" id="sales-invoices">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Sales invoices</span>
          <h2>Current invoice performance</h2>
          <p>Open invoices, remaining amounts and tax totals.</p>
        </div>
      </div>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : salesInvoiceKpi === null ? (
        <p className="loading-copy">Loading sales invoice KPI...</p>
      ) : (
        <div className="kpi-list">
          <KpiCard label="Invoices" value={salesInvoiceKpi.invoicesCount} tone="primary" />
          <KpiCard
            label="Open invoices"
            value={salesInvoiceKpi.openInvoicesCount}
            tone="attention"
          />
          <KpiCard
            label="Remaining amount"
            value={amountFormatter.format(salesInvoiceKpi.totalRemainingAmount)}
            tone="attention"
          />
          <KpiCard
            label="Total excluding tax"
            value={amountFormatter.format(salesInvoiceKpi.totalAmountExcludingTax)}
            tone="blue"
          />
          <KpiCard
            label="Total tax"
            value={amountFormatter.format(salesInvoiceKpi.totalTaxAmount)}
            tone="positive"
          />
          <KpiCard
            label="Total including tax"
            value={amountFormatter.format(salesInvoiceKpi.totalAmountIncludingTax)}
            tone="violet"
          />
        </div>
      )}
    </section>
  )
}

export function PostedSalesInvoiceKpiSection({ postedSalesInvoiceKpi, error, onRetry }) {
  return (
    <section className="dashboard-section" id="posted-invoices">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Posted invoices</span>
          <h2>Posted invoice totals</h2>
          <p>Finalized invoice volume and value from Business Central.</p>
        </div>
      </div>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : postedSalesInvoiceKpi === null ? (
        <p className="loading-copy">Loading posted sales invoice KPI...</p>
      ) : (
        <div className="kpi-list">
          <KpiCard
            label="Posted invoices"
            value={postedSalesInvoiceKpi.postedInvoicesCount}
            tone="positive"
          />
          <KpiCard
            label="Total excluding tax"
            value={amountFormatter.format(postedSalesInvoiceKpi.totalAmountExcludingTax)}
            tone="blue"
          />
          <KpiCard
            label="Total tax"
            value={amountFormatter.format(postedSalesInvoiceKpi.totalTaxAmount)}
            tone="positive"
          />
          <KpiCard
            label="Total including tax"
            value={amountFormatter.format(postedSalesInvoiceKpi.totalAmountIncludingTax)}
            tone="violet"
          />
        </div>
      )}
    </section>
  )
}
