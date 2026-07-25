import { expect, test } from '@playwright/test'

const fixtures = {
  '/api/auth/status': { authenticated: true },
  '/api/auth/login-url': { loginUrl: '/oauth2/authorization/google' },
  '/api/auth/logout-url': { logoutUrl: '/logout' },
  '/api/me': { name: 'Olga Andersson', email: 'olga@example.com', picture: '' },
  '/api/kpi/customers': {
    customersCount: 2,
    customersWithBalanceDueCount: 1,
    totalBalanceDue: 12500,
    averageBalanceDue: 12500,
    largestBalanceDue: 12500,
  },
  '/api/kpi/sales-invoices': {
    invoicesCount: 1,
    openInvoicesCount: 1,
    totalRemainingAmount: 6250,
    totalAmountExcludingTax: 5000,
    totalTaxAmount: 1250,
    totalAmountIncludingTax: 6250,
  },
  '/api/kpi/posted-sales-invoices': {
    postedInvoicesCount: 1,
    totalAmountExcludingTax: 12000,
    totalTaxAmount: 3000,
    totalAmountIncludingTax: 15000,
  },
  '/api/customers/with-balance-due': [
    {
      id: 'customer-1',
      number: '10000',
      displayName: 'Fjord Trading AB',
      email: 'accounts@fjord.example',
      balanceDue: 12500,
      creditLimit: 50000,
      currencyCode: 'SEK',
    },
  ],
  '/api/customers': [
    {
      id: 'customer-1',
      number: '10000',
      displayName: 'Fjord Trading AB',
      email: 'accounts@fjord.example',
      balanceDue: 12500,
      creditLimit: 50000,
      currencyCode: 'SEK',
    },
  ],
  '/api/sales-invoices': [
    {
      id: 'invoice-1',
      number: 'S-1001',
      customerName: 'Fjord Trading AB',
      invoiceDate: '2026-07-01',
      dueDate: '2026-07-31',
      remainingAmount: 6250,
      totalAmountIncludingTax: 6250,
    },
  ],
  '/api/posted-sales-invoices': [
    {
      id: 'posted-invoice-1',
      number: 'PS-1001',
      customerName: 'Aurora Foods',
      invoiceDate: '2026-06-15',
      dueDate: '2026-07-15',
      remainingAmount: null,
      totalAmountIncludingTax: 15000,
    },
  ],
}

async function mockBackend(page, overrides = {}) {
  const responses = { ...fixtures, ...overrides }

  await page.route('http://localhost:8080/api/**', async (route) => {
    const pathname = new URL(route.request().url()).pathname
    const response = responses[pathname]

    if (typeof response === 'function') {
      await response(route)
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'Access-Control-Allow-Origin': 'http://127.0.0.1:4173',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify(response),
    })
  })
}

test('loads the authenticated dashboard and navigates to receivables', async ({ page }) => {
  await mockBackend(page)
  await page.goto('/')

  await expect(page.getByRole('region', { name: 'Key business indicators' })).toBeVisible()
  await page.getByRole('button', { name: 'Receivables', exact: true }).click()

  await expect(page).toHaveURL(/#receivables$/)
  await expect(page.getByRole('heading', { name: 'Customers with balance due' })).toBeVisible()
  await expect(page.getByText('Fjord Trading AB')).toBeVisible()
})

test('shows the login action for a signed-out visitor', async ({ page }) => {
  await mockBackend(page, { '/api/auth/status': { authenticated: false } })
  await page.goto('/')

  await expect(page.getByRole('button', { name: 'Log in with Google' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Dashboard navigation' })).toBeHidden()
})

test('recovers when retrying a failed receivables request', async ({ page }) => {
  let attempts = 0

  await mockBackend(page, {
    '/api/customers/with-balance-due': async (route) => {
      attempts += 1
      const isInitialStrictModeLoad = attempts <= 2
      await route.fulfill({
        status: isInitialStrictModeLoad ? 503 : 200,
        contentType: 'application/json',
        headers: {
          'Access-Control-Allow-Origin': 'http://127.0.0.1:4173',
          'Access-Control-Allow-Credentials': 'true',
        },
        body: JSON.stringify(
          isInitialStrictModeLoad ? {} : fixtures['/api/customers/with-balance-due'],
        ),
      })
    },
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Receivables', exact: true }).click()

  await expect(page.getByRole('alert')).toContainText('Could not load customers with balance due.')
  const attemptsBeforeRetry = attempts
  await page.getByRole('alert').getByRole('button', { name: 'Retry' }).click()

  await expect(page.getByText('Fjord Trading AB')).toBeVisible()
  expect(attempts).toBe(attemptsBeforeRetry + 1)
})
