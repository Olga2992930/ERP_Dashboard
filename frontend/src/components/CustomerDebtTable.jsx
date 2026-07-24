import { amountFormatter } from '../formatters.js'
import LoadError from './LoadError.jsx'

function CustomerDebtTable({ customers, error, onRetry }) {
  return (
    <section className="dashboard-section" id="receivables">
      <div className="section-heading section-heading--table">
        <div>
          <span className="eyebrow">Receivables</span>
          <h2>Customers with balance due</h2>
          <p>Accounts that currently require payment follow-up.</p>
        </div>
        {customers !== null && !error && (
          <span className="count-badge">{customers.length} customers</span>
        )}
      </div>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : customers === null ? (
        <p className="loading-copy">Loading customers...</p>
      ) : customers.length === 0 ? (
        <div className="empty-state">
          <strong>All clear</strong>
          <span>No customers have a balance due.</span>
        </div>
      ) : (
        <div
          className="table-wrapper"
          role="region"
          aria-label="Customers with balance due"
          tabIndex="0"
        >
          <table className="customer-table">
            <thead>
              <tr>
                <th>Number</th>
                <th>Customer</th>
                <th>Email</th>
                <th className="amount-cell">Balance due</th>
                <th>Currency</th>
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
