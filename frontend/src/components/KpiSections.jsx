import { useEffect, useRef, useState } from 'react'
import { amountFormatter } from '../formatters.js'
import LoadError from './LoadError.jsx'
import { useLanguage } from '../i18n.jsx'

const localCurrencyCode = 'SEK'

function currencyCodeFor(record) {
  return record.currencyCode?.trim().toUpperCase() || localCurrencyCode
}

function CurrencyValues({ currencies, field }) {
  if (!currencies?.length) return '—'

  return (
    <span className="currency-values">
      {currencies.map((currency) => (
        <span key={currency.currencyCode}>
          {amountFormatter.format(currency[field])}
          <small>{currency.currencyCode}</small>
        </span>
      ))}
    </span>
  )
}

function KpiCard({ label, value, tone = 'default', onClick, expanded }) {
  const { t } = useLanguage()
  return (
    <button className={`kpi-card kpi-card--${tone}`} type="button" onClick={onClick} aria-expanded={expanded}>
      <span className="kpi-label">{label}</span>
      <strong className="kpi-value">{value}</strong>
      <small className="kpi-card-hint">{t('View details')}</small>
    </button>
  )
}

function DataBreakdown({ title, description, records, error, onRetry, type }) {
  const { t } = useLanguage()
  const breakdownRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [recordFilter, setRecordFilter] = useState('all')

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const supportsInvoiceStatus = type === 'invoice' && records?.some((record) => record.remainingAmount != null)
  const filteredRecords = records?.filter((record) => {
    const matchesSearch = !normalizedSearch || [record.number, record.displayName, record.customerName, record.email]
      .some((value) => value?.toLowerCase().includes(normalizedSearch))
    const matchesFilter = recordFilter === 'all'
      || (recordFilter === 'with-balance' && record.balanceDue > 0)
      || (recordFilter === 'without-balance' && record.balanceDue <= 0)
      || (recordFilter === 'open' && record.remainingAmount > 0)
      || (recordFilter === 'closed' && record.remainingAmount <= 0)
    return matchesSearch && matchesFilter
  }) ?? records

  useEffect(() => {
    if (typeof breakdownRef.current?.scrollIntoView === 'function') {
      breakdownRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [])

  useEffect(() => {
    setSearchTerm('')
    setRecordFilter('all')
  }, [title])

  return (
    <div className="kpi-breakdown" ref={breakdownRef}>
      <div className="kpi-breakdown-heading">
        <div><h3>{title}</h3><p>{description}</p></div>
        {records && <span className="count-badge">{filteredRecords.length} / {records.length} {t('records')}</span>}
      </div>
      {error ? <LoadError message={error} onRetry={onRetry} /> : records === null ? (
        <p className="loading-copy">{t('Loading details...')}</p>
      ) : records.length === 0 ? <div className="empty-state"><strong>{t('No matching records')}</strong></div> : (
        <>
          <div className="table-tools">
            <label className="table-search"><span>{t('Search')}</span><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={t('Search by number, customer or email')} /></label>
            {(type === 'customer' || supportsInvoiceStatus) && (
              <label className="table-filter"><span>{t('Filter')}</span><select value={recordFilter} onChange={(event) => setRecordFilter(event.target.value)}>
                <option value="all">{t('All records')}</option>
                {type === 'customer' ? <><option value="with-balance">{t('With balance due')}</option><option value="without-balance">{t('Without balance due')}</option></> : <><option value="open">{t('Open')}</option><option value="closed">{t('Closed')}</option></>}
              </select></label>
            )}
          </div>
          {filteredRecords.length === 0 ? <div className="empty-state"><strong>{t('No matching records')}</strong><span>{t('Try changing your search or filter.')}</span></div> : <div className="table-wrapper" role="region" aria-label={title} tabIndex="0">
          <table className="customer-table kpi-detail-table">
            <thead><tr>{type === 'customer' ? <><th>{t('Number')}</th><th>{t('Customer')}</th><th>{t('Email')}</th><th className="amount-cell">{t('Balance due')}, SEK</th><th className="amount-cell">{t('Credit limit')}, SEK</th></> : <><th>{t('Number')}</th><th>{t('Customer')}</th><th>{t('Date')}</th><th>{t('Due date')}</th><th className="amount-cell">{t('Remaining')}</th><th className="amount-cell">{t('Total')}</th><th>{t('Currency')}</th></>}</tr></thead>
            <tbody>{filteredRecords.map((record) => type === 'customer' ? (
              <tr key={record.id}><td>{record.number}</td><td>{record.displayName}</td><td>{record.email || '-'}</td><td className="amount-cell">{amountFormatter.format(record.balanceDue)}</td><td className="amount-cell">{amountFormatter.format(record.creditLimit)}</td></tr>
            ) : (
              <tr key={record.id}><td>{record.number}</td><td>{record.customerName}</td><td>{record.invoiceDate || '-'}</td><td>{record.dueDate || '-'}</td><td className="amount-cell">{record.remainingAmount == null ? '—' : amountFormatter.format(record.remainingAmount)}</td><td className="amount-cell">{amountFormatter.format(record.totalAmountIncludingTax)}</td><td>{currencyCodeFor(record)}</td></tr>
            ))}</tbody>
          </table>
        </div>}
        </>
      )}
    </div>
  )
}

function SummaryCard({ label, value, symbol, tone, onClick }) {
  const { t } = useLanguage()
  return (
    <button
      className={`summary-kpi-card summary-kpi-card--${tone}`}
      type="button"
      onClick={onClick}
      aria-label={t('Open {label} section', { label })}
    >
      <span className="summary-kpi-accent" aria-hidden="true" />
      <span className="summary-kpi-symbol" aria-hidden="true">{symbol}</span>
      <span className="summary-kpi-label">{label}</span>
      <strong className="summary-kpi-value">{value ?? '—'}</strong>
      <small>{t('Business Central')}</small>
    </button>
  )
}

export function SummaryKpiRow({ customerKpi, salesInvoiceKpi, postedSalesInvoiceKpi, onSelectSection }) {
  const { t } = useLanguage()
  return (
    <section className="summary-kpis" aria-label={t('Key business indicators')}>
      <SummaryCard
        label={t('Customers')}
        value={customerKpi?.customersCount}
        symbol="C"
        tone="purple"
        onClick={() => onSelectSection('customers')}
      />
      <SummaryCard
        label={`${t('Balance due')}, SEK`}
        value={customerKpi ? amountFormatter.format(customerKpi.totalBalanceDue) : null}
        symbol="$"
        tone="cyan"
        onClick={() => onSelectSection('receivables')}
      />
      <SummaryCard
        label={t('Open invoices')}
        value={salesInvoiceKpi?.openInvoicesCount}
        symbol="I"
        tone="violet"
        onClick={() => onSelectSection('sales-invoices')}
      />
      <SummaryCard
        label={t('Posted invoices')}
        value={postedSalesInvoiceKpi?.postedInvoicesCount}
        symbol="P"
        tone="blue"
        onClick={() => onSelectSection('posted-invoices')}
      />
    </section>
  )
}

export function CustomerKpiSection({ customerKpi, error, onRetry, records, recordsError, onRetryRecords }) {
  const { t } = useLanguage()
  const [detail, setDetail] = useState(null)
  const recordsRequested = useRef(false)
  const show = (key) => {
    const opening = detail !== key
    setDetail(opening ? key : null)
    if (opening && records === null && !recordsError && !recordsRequested.current) {
      recordsRequested.current = true
      onRetryRecords()
    }
  }
  const balanceRecords = records?.filter((record) => record.balanceDue > 0) ?? records
  const largestBalance = records?.reduce((largest, record) => Math.max(largest, record.balanceDue), 0)
  const detailRecords = detail === 'with-balance' || detail === 'total' ? balanceRecords : detail === 'largest' && records ? records.filter((record) => record.balanceDue === largestBalance) : records
  return (
    <section className="dashboard-section" id="customers">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t('Customers')}</span>
          <h2>{t('Customer overview')}</h2>
          <p>{t('Customer base and outstanding receivables.')}</p>
        </div>
      </div>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : customerKpi === null ? (
        <p className="loading-copy">{t('Loading customer KPI...')}</p>
      ) : (
        <div className="kpi-list">
          <KpiCard label={t('Customers')} value={customerKpi.customersCount} tone="primary" onClick={() => show('customers')} expanded={detail === 'customers'} />
          <KpiCard
            label={t('Customers with balance due')}
            value={customerKpi.customersWithBalanceDueCount}
            tone="attention"
            onClick={() => show('with-balance')} expanded={detail === 'with-balance'}
          />
          <KpiCard
            label={`${t('Total balance due')}, SEK`}
            value={amountFormatter.format(customerKpi.totalBalanceDue)}
            tone="attention"
            onClick={() => show('total')} expanded={detail === 'total'}
          />
          <KpiCard
            label={`${t('Average balance due')}, SEK`}
            value={amountFormatter.format(customerKpi.averageBalanceDue)}
            onClick={() => show('average')} expanded={detail === 'average'}
          />
          <KpiCard
            label={`${t('Largest balance due')}, SEK`}
            value={amountFormatter.format(customerKpi.largestBalanceDue)}
            onClick={() => show('largest')} expanded={detail === 'largest'}
          />
        </div>
      )}
      {detail && <DataBreakdown title={`${t(detail === 'customers' ? 'Customers' : detail === 'with-balance' ? 'Customers with balance due' : detail === 'total' ? 'Total balance due' : detail === 'average' ? 'Average balance due' : 'Largest balance due')} ${t('details')}`} description={t('Records used to calculate this KPI in Business Central.')} records={detailRecords} error={recordsError} onRetry={onRetryRecords} type="customer" />}
    </section>
  )
}

export function SalesInvoiceKpiSection({ salesInvoiceKpi, error, onRetry, records, recordsError, onRetryRecords }) {
  const { t } = useLanguage()
  const [detail, setDetail] = useState(null)
  const recordsRequested = useRef(false)
  const show = (key) => {
    const opening = detail !== key
    setDetail(opening ? key : null)
    if (opening && records === null && !recordsError && !recordsRequested.current) {
      recordsRequested.current = true
      onRetryRecords()
    }
  }
  const detailRecords = detail === 'open' || detail === 'remaining' ? records?.filter((record) => record.remainingAmount > 0) ?? records : records
  return (
    <section className="dashboard-section" id="sales-invoices">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t('Sales invoices')}</span>
          <h2>{t('Current invoice performance')}</h2>
          <p>{t('Open invoices, remaining amounts and tax totals.')}</p>
        </div>
      </div>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : salesInvoiceKpi === null ? (
        <p className="loading-copy">{t('Loading sales invoice KPI...')}</p>
      ) : (
        <div className="kpi-list">
          <KpiCard label={t('Invoices')} value={salesInvoiceKpi.invoicesCount} tone="primary" onClick={() => show('invoices')} expanded={detail === 'invoices'} />
          <KpiCard
            label={t('Open invoices')}
            value={salesInvoiceKpi.openInvoicesCount}
            tone="attention"
            onClick={() => show('open')} expanded={detail === 'open'}
          />
          <KpiCard
            label={t('Remaining amount')}
            value={<CurrencyValues currencies={salesInvoiceKpi.currencies} field="totalRemainingAmount" />}
            tone="attention"
            onClick={() => show('remaining')} expanded={detail === 'remaining'}
          />
          <KpiCard
            label={t('Total excluding tax')}
            value={<CurrencyValues currencies={salesInvoiceKpi.currencies} field="totalAmountExcludingTax" />}
            tone="blue"
            onClick={() => show('excluding-tax')} expanded={detail === 'excluding-tax'}
          />
          <KpiCard
            label={t('Total tax')}
            value={<CurrencyValues currencies={salesInvoiceKpi.currencies} field="totalTaxAmount" />}
            tone="positive"
            onClick={() => show('tax')} expanded={detail === 'tax'}
          />
          <KpiCard
            label={t('Total including tax')}
            value={<CurrencyValues currencies={salesInvoiceKpi.currencies} field="totalAmountIncludingTax" />}
            tone="violet"
            onClick={() => show('including-tax')} expanded={detail === 'including-tax'}
          />
        </div>
      )}
      {detail && <DataBreakdown title={t('Sales invoice details')} description={t('Invoices used to calculate the selected KPI.')} records={detailRecords} error={recordsError} onRetry={onRetryRecords} type="invoice" />}
    </section>
  )
}

export function PostedSalesInvoiceKpiSection({ postedSalesInvoiceKpi, error, onRetry, records, recordsError, onRetryRecords }) {
  const { t } = useLanguage()
  const [detail, setDetail] = useState(null)
  const recordsRequested = useRef(false)
  const show = (key) => {
    const opening = detail !== key
    setDetail(opening ? key : null)
    if (opening && records === null && !recordsError && !recordsRequested.current) {
      recordsRequested.current = true
      onRetryRecords()
    }
  }
  return (
    <section className="dashboard-section" id="posted-invoices">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{t('Posted invoices')}</span>
          <h2>{t('Posted invoice totals')}</h2>
          <p>{t('Finalized invoice volume and value from Business Central.')}</p>
        </div>
      </div>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : postedSalesInvoiceKpi === null ? (
        <p className="loading-copy">{t('Loading posted sales invoice KPI...')}</p>
      ) : (
        <div className="kpi-list">
          <KpiCard
            label={t('Posted invoices')}
            value={postedSalesInvoiceKpi.postedInvoicesCount}
            tone="positive"
            onClick={() => show('posted')} expanded={detail === 'posted'}
          />
          <KpiCard
            label={t('Total excluding tax')}
            value={<CurrencyValues currencies={postedSalesInvoiceKpi.currencies} field="totalAmountExcludingTax" />}
            tone="blue"
            onClick={() => show('excluding-tax')} expanded={detail === 'excluding-tax'}
          />
          <KpiCard
            label={t('Total tax')}
            value={<CurrencyValues currencies={postedSalesInvoiceKpi.currencies} field="totalTaxAmount" />}
            tone="positive"
            onClick={() => show('tax')} expanded={detail === 'tax'}
          />
          <KpiCard
            label={t('Total including tax')}
            value={<CurrencyValues currencies={postedSalesInvoiceKpi.currencies} field="totalAmountIncludingTax" />}
            tone="violet"
            onClick={() => show('including-tax')} expanded={detail === 'including-tax'}
          />
        </div>
      )}
      {detail && <DataBreakdown title={t('Posted invoice details')} description={t('Posted invoices used to calculate the selected KPI.')} records={records} error={recordsError} onRetry={onRetryRecords} type="invoice" />}
    </section>
  )
}
