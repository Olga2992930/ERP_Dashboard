import { useEffect, useState } from 'react'
import './App.css'

const backendUrl = 'http://localhost:8080'
const amountFormatter = new Intl.NumberFormat('sv-SE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function App() {
  const [authenticated, setAuthenticated] = useState(null)
  const [loginUrl, setLoginUrl] = useState(null)
  const [logoutUrl, setLogoutUrl] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [customerKpi, setCustomerKpi] = useState(null)
  const [salesInvoiceKpi, setSalesInvoiceKpi] = useState(null)
  const [postedSalesInvoiceKpi, setPostedSalesInvoiceKpi] = useState(null)
  const [customersWithBalanceDue, setCustomersWithBalanceDue] = useState(null)

  useEffect(() => {
    const fetchFromBackend = (path) =>
      fetch(`${backendUrl}${path}`, { credentials: 'include' }).then((response) =>
        response.json(),
      )

    Promise.all([
      fetchFromBackend('/api/auth/status'),
      fetchFromBackend('/api/auth/login-url'),
      fetchFromBackend('/api/auth/logout-url'),
    ]).then(([authStatus, login, logout]) => {
      setAuthenticated(authStatus.authenticated)
      setLoginUrl(login.loginUrl)
      setLogoutUrl(logout.logoutUrl)

      if (authStatus.authenticated) {
        Promise.all([
          fetchFromBackend('/api/me'),
          fetchFromBackend('/api/kpi/customers'),
          fetchFromBackend('/api/kpi/sales-invoices'),
          fetchFromBackend('/api/kpi/posted-sales-invoices'),
          fetchFromBackend('/api/customers/with-balance-due'),
        ]).then(
          ([
            user,
            customerKpiData,
            salesInvoiceKpiData,
            postedSalesInvoiceKpiData,
            customersWithBalanceDueData,
          ]) => {
            setCurrentUser(user)
            setCustomerKpi(customerKpiData)
            setSalesInvoiceKpi(salesInvoiceKpiData)
            setPostedSalesInvoiceKpi(postedSalesInvoiceKpiData)
            setCustomersWithBalanceDue(customersWithBalanceDueData)
          },
        )
      }
    })
  }, [])

  const navigateToBackend = (path) => {
    window.location.href = new URL(path, backendUrl).toString()
  }

  return (
    <main>
      <h1>ERP Dashboard</h1>
      <p>Business Central analytics and KPI dashboard</p>

      <p>
        Auth status:{' '}
        {authenticated === null ? 'Checking...' : authenticated ? 'Logged in' : 'Logged out'}
      </p>

      {authenticated === false && loginUrl && (
        <button type="button" onClick={() => navigateToBackend(loginUrl)}>
          Log in with Google
        </button>
      )}

      {authenticated === true && (
        <section>
          <h2>Current user</h2>
          {currentUser === null ? (
            <p>Loading user...</p>
          ) : (
            <>
              <p>Name: {currentUser.name}</p>
              <p>Email: {currentUser.email}</p>
            </>
          )}
        </section>
      )}

      {authenticated === true && (
        <section>
          <h2>Customer KPI</h2>
          {customerKpi === null ? (
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
      )}

      {authenticated === true && (
        <section>
          <h2>Sales invoice KPI</h2>
          {salesInvoiceKpi === null ? (
            <p>Loading sales invoice KPI...</p>
          ) : (
            <>
              <p>Invoices: {salesInvoiceKpi.invoicesCount}</p>
              <p>Open invoices: {salesInvoiceKpi.openInvoicesCount}</p>
              <p>
                Remaining amount: {amountFormatter.format(salesInvoiceKpi.totalRemainingAmount)}
              </p>
              <p>
                Total excluding tax:{' '}
                {amountFormatter.format(salesInvoiceKpi.totalAmountExcludingTax)}
              </p>
              <p>Total tax: {amountFormatter.format(salesInvoiceKpi.totalTaxAmount)}</p>
              <p>
                Total including tax:{' '}
                {amountFormatter.format(salesInvoiceKpi.totalAmountIncludingTax)}
              </p>
            </>
          )}
        </section>
      )}

      {authenticated === true && (
        <section>
          <h2>Posted sales invoice KPI</h2>
          {postedSalesInvoiceKpi === null ? (
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
      )}

      {authenticated === true && (
        <section>
          <h2>Customers with balance due</h2>
          {customersWithBalanceDue === null ? (
            <p>Loading customers...</p>
          ) : customersWithBalanceDue.length === 0 ? (
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
                {customersWithBalanceDue.map((customer) => (
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
      )}

      {authenticated === true && logoutUrl && (
        <button type="button" onClick={() => navigateToBackend(logoutUrl)}>
          Log out
        </button>
      )}
    </main>
  )
}

export default App
