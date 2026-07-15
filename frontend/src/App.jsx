import { useEffect, useState } from 'react'
import './App.css'

const backendUrl = 'http://localhost:8080'
const amountFormatter = new Intl.NumberFormat('sv-SE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

async function fetchFromBackend(path) {
  const response = await fetch(`${backendUrl}${path}`, { credentials: 'include' })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json()
}

function LoadError({ message, onRetry }) {
  return (
    <div role="alert">
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

function App() {
  const [authenticated, setAuthenticated] = useState(null)
  const [loginUrl, setLoginUrl] = useState(null)
  const [logoutUrl, setLogoutUrl] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [customerKpi, setCustomerKpi] = useState(null)
  const [salesInvoiceKpi, setSalesInvoiceKpi] = useState(null)
  const [postedSalesInvoiceKpi, setPostedSalesInvoiceKpi] = useState(null)
  const [customersWithBalanceDue, setCustomersWithBalanceDue] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [loginUrlError, setLoginUrlError] = useState(null)
  const [logoutUrlError, setLogoutUrlError] = useState(null)
  const [currentUserError, setCurrentUserError] = useState(null)
  const [customerKpiError, setCustomerKpiError] = useState(null)
  const [salesInvoiceKpiError, setSalesInvoiceKpiError] = useState(null)
  const [postedSalesInvoiceKpiError, setPostedSalesInvoiceKpiError] = useState(null)
  const [customersWithBalanceDueError, setCustomersWithBalanceDueError] = useState(null)

  const loadResource = (path, setData, setError, errorMessage) => {
    setError(null)

    return fetchFromBackend(path)
      .then(setData)
      .catch(() => setError(errorMessage))
  }

  const loadCurrentUser = () =>
    loadResource('/api/me', setCurrentUser, setCurrentUserError, 'Could not load current user.')

  const loadCustomerKpi = () =>
    loadResource(
      '/api/kpi/customers',
      setCustomerKpi,
      setCustomerKpiError,
      'Could not load customer KPI.',
    )

  const loadSalesInvoiceKpi = () =>
    loadResource(
      '/api/kpi/sales-invoices',
      setSalesInvoiceKpi,
      setSalesInvoiceKpiError,
      'Could not load sales invoice KPI.',
    )

  const loadPostedSalesInvoiceKpi = () =>
    loadResource(
      '/api/kpi/posted-sales-invoices',
      setPostedSalesInvoiceKpi,
      setPostedSalesInvoiceKpiError,
      'Could not load posted sales invoice KPI.',
    )

  const loadCustomersWithBalanceDue = () =>
    loadResource(
      '/api/customers/with-balance-due',
      setCustomersWithBalanceDue,
      setCustomersWithBalanceDueError,
      'Could not load customers with balance due.',
    )

  const loadProtectedData = () => {
    loadCurrentUser()
    loadCustomerKpi()
    loadSalesInvoiceKpi()
    loadPostedSalesInvoiceKpi()
    loadCustomersWithBalanceDue()
  }

  const loadAuthStatus = () => {
    setAuthError(null)

    return fetchFromBackend('/api/auth/status')
      .then((authStatus) => {
        setAuthenticated(authStatus.authenticated)

        if (authStatus.authenticated) {
          loadProtectedData()
        }
      })
      .catch(() => setAuthError('Could not check authentication status.'))
  }

  const loadLoginUrl = () =>
    loadResource(
      '/api/auth/login-url',
      (login) => setLoginUrl(login.loginUrl),
      setLoginUrlError,
      'Could not load the login link.',
    )

  const loadLogoutUrl = () =>
    loadResource(
      '/api/auth/logout-url',
      (logout) => setLogoutUrl(logout.logoutUrl),
      setLogoutUrlError,
      'Could not load the logout link.',
    )

  useEffect(() => {
    loadAuthStatus()
    loadLoginUrl()
    loadLogoutUrl()
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
        {authError
          ? 'Unavailable'
          : authenticated === null
            ? 'Checking...'
            : authenticated
              ? 'Logged in'
              : 'Logged out'}
      </p>

      {authError && <LoadError message={authError} onRetry={loadAuthStatus} />}

      {authenticated === false && (
        <>
          {loginUrlError ? (
            <LoadError message={loginUrlError} onRetry={loadLoginUrl} />
          ) : loginUrl === null ? (
            <p>Loading login link...</p>
          ) : (
            <button type="button" onClick={() => navigateToBackend(loginUrl)}>
              Log in with Google
            </button>
          )}
        </>
      )}

      {authenticated === true && (
        <section>
          <h2>Current user</h2>
          {currentUserError ? (
            <LoadError message={currentUserError} onRetry={loadCurrentUser} />
          ) : currentUser === null ? (
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
          {customerKpiError ? (
            <LoadError message={customerKpiError} onRetry={loadCustomerKpi} />
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
      )}

      {authenticated === true && (
        <section>
          <h2>Sales invoice KPI</h2>
          {salesInvoiceKpiError ? (
            <LoadError message={salesInvoiceKpiError} onRetry={loadSalesInvoiceKpi} />
          ) : salesInvoiceKpi === null ? (
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
          {postedSalesInvoiceKpiError ? (
            <LoadError
              message={postedSalesInvoiceKpiError}
              onRetry={loadPostedSalesInvoiceKpi}
            />
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
      )}

      {authenticated === true && (
        <section>
          <h2>Customers with balance due</h2>
          {customersWithBalanceDueError ? (
            <LoadError
              message={customersWithBalanceDueError}
              onRetry={loadCustomersWithBalanceDue}
            />
          ) : customersWithBalanceDue === null ? (
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

      {authenticated === true && (
        <>
          {logoutUrlError ? (
            <LoadError message={logoutUrlError} onRetry={loadLogoutUrl} />
          ) : logoutUrl === null ? (
            <p>Loading logout link...</p>
          ) : (
            <button type="button" onClick={() => navigateToBackend(logoutUrl)}>
              Log out
            </button>
          )}
        </>
      )}
    </main>
  )
}

export default App
