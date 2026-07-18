import { amountFormatter } from '../formatters.js'
import LoadError from './LoadError.jsx'

function CustomerDebtTable({ customers, error, onRetry }) {
  return (
    <section>
      <h2>Customers with balance due</h2>
      {error ? (
        <LoadError message={error} onRetry={onRetry} />
      ) : customers === null ? (
        <p>Loading customers...</p>
      ) : customers.length === 0 ? (
        <p>No customers have a balance due.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Number</th>
              <th>Customer</th>
              <th>Email</th>
              <th>Balance due</th>
              <th>Currency</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.number}</td>
                <td>{customer.displayName}</td>
                <td>{customer.email || '-'}</td>
                <td>{amountFormatter.format(customer.balanceDue)}</td>
                <td>{customer.currencyCode || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default CustomerDebtTable
