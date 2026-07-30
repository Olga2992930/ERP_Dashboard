import { useState } from 'react'
import { amountFormatter } from '../formatters.js'
import LoadError from './LoadError.jsx'
import { useLanguage } from '../i18n.jsx'

function CustomerDebtTable({ customers, error, onRetry }) {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [currencyFilter, setCurrencyFilter] = useState('all')
  const currencies = [...new Set((customers ?? []).map((customer) => customer.currencyCode).filter(Boolean))].sort()
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const hasActiveFilters = Boolean(normalizedSearch) || currencyFilter !== 'all'
  const filteredCustomers = customers?.filter((customer) => {
    const matchesSearch = !normalizedSearch || [customer.number, customer.displayName, customer.email]
      .some((value) => value?.toLowerCase().includes(normalizedSearch))
    const matchesCurrency = currencyFilter === 'all' || customer.currencyCode === currencyFilter
    return matchesSearch && matchesCurrency
  }) ?? customers
  return (
    <section className="dashboard-section" id="receivables">
      <div className="section-heading section-heading--table">
        <div>
          <span className="eyebrow">{t('Receivables')}</span>
          <h2>{t('Customers with balance due')}</h2>
          <p>{t('Accounts that currently require payment follow-up.')}</p>
        </div>
        {customers !== null && !error && (
          <span className="count-badge">{hasActiveFilters ? `${filteredCustomers.length} / ${customers.length}` : customers.length} {t('Customers').toLowerCase()}</span>
        )}
      </div>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : customers === null ? (
        <p className="loading-copy">{t('Loading customers...')}</p>
      ) : customers.length === 0 ? (
        <div className="empty-state">
          <strong>{t('All clear')}</strong>
          <span>{t('No customers have a balance due.')}</span>
        </div>
      ) : (
        <>
          <div className="table-tools">
            <label className="table-search"><span>{t('Search')}</span><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={t('Search by number, customer or email')} /></label>
            {currencies.length > 1 && <label className="table-filter"><span>{t('Currency')}</span><select value={currencyFilter} onChange={(event) => setCurrencyFilter(event.target.value)}><option value="all">{t('All currencies')}</option>{currencies.map((currency) => <option key={currency} value={currency}>{currency}</option>)}</select></label>}
          </div>
          {filteredCustomers.length === 0 ? <div className="empty-state"><strong>{t('No matching records')}</strong><span>{t('Try changing your search or filter.')}</span></div> : <div
          className="table-wrapper"
          role="region"
          aria-label={t('Customers with balance due')}
          tabIndex="0"
        >
          <table className="customer-table">
            <thead>
              <tr>
                <th>{t('Number')}</th>
                <th>{t('Customer')}</th>
                <th>{t('Email')}</th>
                <th className="amount-cell">{t('Balance due')}</th>
                <th>{t('Currency')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.number}</td>
                  <td>{customer.displayName}</td>
                  <td>{customer.email || '-'}</td>
                  <td className="amount-cell">{amountFormatter.format(customer.balanceDue)}</td>
                  <td>{customer.currencyCode || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
        </>
      )}
    </section>
  )
}

export default CustomerDebtTable
