import { amountFormatter } from '../formatters.js'
import LoadError from './LoadError.jsx'
import { useLanguage } from '../i18n.jsx'

function CustomerDebtTable({ customers, error, onRetry }) {
  const { t } = useLanguage()
  return (
    <section className="dashboard-section" id="receivables">
      <div className="section-heading section-heading--table">
        <div>
          <span className="eyebrow">{t('Receivables')}</span>
          <h2>{t('Customers with balance due')}</h2>
          <p>{t('Accounts that currently require payment follow-up.')}</p>
        </div>
        {customers !== null && !error && (
          <span className="count-badge">{customers.length} {t('Customers').toLowerCase()}</span>
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
        <div
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
              {customers.map((customer) => (
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
        </div>
      )}
    </section>
  )
}

export default CustomerDebtTable
