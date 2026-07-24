import { useEffect, useState } from 'react'
import './App.css'
import { fetchFromBackend, getBackendUrl } from './api.js'
import erpBoardLogo from './assets/erp-board-logo.png'
import CustomerDebtTable from './components/CustomerDebtTable.jsx'
import {
  CustomerKpiSection,
  PostedSalesInvoiceKpiSection,
  SalesInvoiceKpiSection,
  SummaryKpiRow,
} from './components/KpiSections.jsx'
import LoadError from './components/LoadError.jsx'
import UserMenu from './components/UserMenu.jsx'

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
    <div className={`app-shell${authenticated === true ? ' app-shell--authenticated' : ''}`}>
      <header className="app-header">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-mark" aria-hidden="true">
              ERP
            </div>
            <div className="brand-copy">
              <h1>ERP Dashboard</h1>
              <span>Visual operations</span>
            </div>
          </div>

          {authenticated === true && (
            <div className="header-context" aria-label="Current workspace">
              <span>
                <strong>Welcome back, {currentUser?.name || 'ERP user'}</strong>
                <small>Here is today&apos;s business overview.</small>
              </span>
            </div>
          )}

          {authenticated === true && (
            <div className="board-state">
              <span className="board-state-dot" aria-hidden="true" />
              <span>
                <strong>Live data</strong>
                <small>Updated from Business Central</small>
              </span>
            </div>
          )}

          <div className="header-actions">
            {authenticated === true && (
              <UserMenu
                currentUser={currentUser}
                currentUserError={currentUserError}
                onRetryCurrentUser={loadCurrentUser}
                logoutUrl={logoutUrl}
                logoutUrlError={logoutUrlError}
                onRetryLogoutUrl={loadLogoutUrl}
                onLogout={navigateToBackend}
              />
            )}
          </div>
        </div>
      </header>

      <div className={`app-body${authenticated === true ? ' app-body--authenticated' : ''}`}>
        {authenticated === true && (
          <aside className="side-panel">
            <div className="side-panel-brand">
              <img className="side-panel-brand-logo" src={erpBoardLogo} alt="ERP Board" />
            </div>
            <nav className="side-nav" aria-label="Dashboard navigation">
              <span className="side-nav-label">Main menu</span>
              <a className="nav-link nav-link--active" href="#overview">
                <span className="nav-icon" aria-hidden="true">⌂</span>
                Overview
              </a>
              <a className="nav-link" href="#customers">
                <span className="nav-icon" aria-hidden="true">◎</span>
                Customers
              </a>
              <a className="nav-link" href="#sales-invoices">
                <span className="nav-icon" aria-hidden="true">↗</span>
                Sales invoices
              </a>
              <a className="nav-link" href="#posted-invoices">
                <span className="nav-icon" aria-hidden="true">✓</span>
                Posted invoices
              </a>
              <a className="nav-link" href="#receivables">
                <span className="nav-icon" aria-hidden="true">◷</span>
                Receivables
              </a>
            </nav>

            {logoutUrl !== null && !logoutUrlError && (
              <button
                className="side-logout"
                type="button"
                onClick={() => navigateToBackend(logoutUrl)}
              >
                <span aria-hidden="true">↪</span>
                Log out
              </button>
            )}
          </aside>
        )}

        <main className="dashboard">
          <section className="page-heading" id="overview">
            <div className="page-heading-copy">
              <span className="eyebrow">Analytics</span>
              <h2>Dashboard overview</h2>
              <p>Customers, invoice performance and receivables at a glance.</p>
            </div>

            <div className="page-heading-actions">
              {authenticated === false &&
                (loginUrlError ? (
                  <LoadError message={loginUrlError} onRetry={loadLoginUrl} compact />
                ) : loginUrl === null ? (
                  <span className="loading-inline">Preparing secure login...</span>
                ) : (
                  <button
                    className="button button--primary"
                    type="button"
                    onClick={() => navigateToBackend(loginUrl)}
                  >
                    Log in with Google
                  </button>
                ))}
            </div>
          </section>

          {authError && <LoadError message={authError} onRetry={loadAuthStatus} />}

          {authenticated === true && (
            <div className="dashboard-content">
              <SummaryKpiRow
                customerKpi={customerKpi}
                salesInvoiceKpi={salesInvoiceKpi}
                postedSalesInvoiceKpi={postedSalesInvoiceKpi}
              />

              <CustomerKpiSection
                customerKpi={customerKpi}
                error={customerKpiError}
                onRetry={loadCustomerKpi}
              />

              <SalesInvoiceKpiSection
                salesInvoiceKpi={salesInvoiceKpi}
                error={salesInvoiceKpiError}
                onRetry={loadSalesInvoiceKpi}
              />

              <PostedSalesInvoiceKpiSection
                postedSalesInvoiceKpi={postedSalesInvoiceKpi}
                error={postedSalesInvoiceKpiError}
                onRetry={loadPostedSalesInvoiceKpi}
              />

              <CustomerDebtTable
                customers={customersWithBalanceDue}
                error={customersWithBalanceDueError}
                onRetry={loadCustomersWithBalanceDue}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
