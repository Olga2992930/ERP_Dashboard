import { useEffect, useState } from 'react'
import './App.css'
import { fetchFromBackend, getBackendUrl } from './api.js'
import CurrentUserSection from './components/CurrentUserSection.jsx'
import CustomerDebtTable from './components/CustomerDebtTable.jsx'
import {
  CustomerKpiSection,
  PostedSalesInvoiceKpiSection,
  SalesInvoiceKpiSection,
} from './components/KpiSections.jsx'
import LoadError from './components/LoadError.jsx'

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
    window.location.href = getBackendUrl(path)
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
        <CurrentUserSection
          currentUser={currentUser}
          error={currentUserError}
          onRetry={loadCurrentUser}
        />
      )}

      {authenticated === true && (
        <CustomerKpiSection
          customerKpi={customerKpi}
          error={customerKpiError}
          onRetry={loadCustomerKpi}
        />
      )}

      {authenticated === true && (
        <SalesInvoiceKpiSection
          salesInvoiceKpi={salesInvoiceKpi}
          error={salesInvoiceKpiError}
          onRetry={loadSalesInvoiceKpi}
        />
      )}

      {authenticated === true && (
        <PostedSalesInvoiceKpiSection
          postedSalesInvoiceKpi={postedSalesInvoiceKpi}
          error={postedSalesInvoiceKpiError}
          onRetry={loadPostedSalesInvoiceKpi}
        />
      )}

      {authenticated === true && (
        <CustomerDebtTable
          customers={customersWithBalanceDue}
          error={customersWithBalanceDueError}
          onRetry={loadCustomersWithBalanceDue}
        />
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
