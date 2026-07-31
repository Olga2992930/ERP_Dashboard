import { http, HttpResponse } from 'msw'

export const backendUrl = 'http://localhost:8080'

export const customers = [
  {
    id: 'customer-1',
    number: '10000',
    displayName: 'Fjord Trading AB',
    email: 'accounts@fjord.example',
    phoneNumber: '+46 8 555 0100',
    balanceDue: 12500,
    creditLimit: 50000,
    currencyCode: 'SEK',
  },
  {
    id: 'customer-2',
    number: '20000',
    displayName: 'Northwind Retail',
    email: 'finance@northwind.example',
    phoneNumber: '+46 31 555 0200',
    balanceDue: 0,
    creditLimit: 30000,
    currencyCode: 'SEK',
  },
  {
    id: 'customer-3',
    number: '30000',
    displayName: 'Aurora Foods',
    email: '',
    phoneNumber: '+46 40 555 0300',
    balanceDue: 7500,
    creditLimit: 25000,
    currencyCode: 'SEK',
  },
]

export const customersWithBalanceDue = customers.filter((customer) => customer.balanceDue > 0)

export const salesInvoices = [
  {
    id: 'sales-invoice-1',
    number: 'S-1001',
    invoiceDate: '2026-07-01',
    postingDate: '2026-07-01',
    dueDate: '2026-07-31',
    customerNumber: '10000',
    customerName: 'Fjord Trading AB',
    currencyCode: 'SEK',
    remainingAmount: 6250,
    totalAmountExcludingTax: 5000,
    totalTaxAmount: 1250,
    totalAmountIncludingTax: 6250,
    status: 'Open',
    salesperson: 'SE',
    email: 'accounts@fjord.example',
  },
  {
    id: 'sales-invoice-2',
    number: 'S-1002',
    invoiceDate: '2026-07-02',
    postingDate: '2026-07-02',
    dueDate: '2026-08-01',
    customerNumber: '20000',
    customerName: 'Northwind Retail',
    currencyCode: 'SEK',
    remainingAmount: 0,
    totalAmountExcludingTax: 8000,
    totalTaxAmount: 2000,
    totalAmountIncludingTax: 10000,
    status: 'Paid',
    salesperson: 'SE',
    email: 'finance@northwind.example',
  },
]

export const postedSalesInvoices = [
  {
    id: 'posted-invoice-1',
    number: 'PS-1001',
    invoiceDate: '2026-06-15',
    postingDate: '2026-06-15',
    dueDate: '2026-07-15',
    customerNumber: '30000',
    customerName: 'Aurora Foods',
    currencyCode: 'SEK',
    totalAmountExcludingTax: 12000,
    totalTaxAmount: 3000,
    totalAmountIncludingTax: 15000,
    salesperson: 'SE',
    email: '',
  },
]

export const handlers = [
  http.get(`${backendUrl}/api/auth/status`, () =>
    HttpResponse.json({ authenticated: true }),
  ),
  http.get(`${backendUrl}/api/auth/login-url`, () =>
    HttpResponse.json({ loginUrl: '/oauth2/authorization/google' }),
  ),
  http.get(`${backendUrl}/api/auth/logout-url`, () =>
    HttpResponse.json({ logoutUrl: '/logout' }),
  ),
  http.get(`${backendUrl}/api/me`, () =>
    HttpResponse.json({
      name: 'Olga Andersson',
      email: 'olga@example.com',
      picture: '',
    }),
  ),
  http.get(`${backendUrl}/api/kpi/customers`, () =>
    HttpResponse.json({
      customersCount: customers.length,
      customersWithBalanceDueCount: customersWithBalanceDue.length,
      totalBalanceDue: 20000,
      averageBalanceDue: 10000,
      largestBalanceDue: 12500,
    }),
  ),
  http.get(`${backendUrl}/api/kpi/sales-invoices`, () =>
    HttpResponse.json({
      invoicesCount: salesInvoices.length,
      openInvoicesCount: 1,
      currencies: [{
        currencyCode: 'SEK',
        totalRemainingAmount: 6250,
        totalAmountExcludingTax: 13000,
        totalTaxAmount: 3250,
        totalAmountIncludingTax: 16250,
      }],
    }),
  ),
  http.get(`${backendUrl}/api/kpi/posted-sales-invoices`, () =>
    HttpResponse.json({
      postedInvoicesCount: postedSalesInvoices.length,
      currencies: [{
        currencyCode: 'SEK',
        totalAmountExcludingTax: 12000,
        totalTaxAmount: 3000,
        totalAmountIncludingTax: 15000,
      }],
    }),
  ),
  http.get(`${backendUrl}/api/customers/with-balance-due`, () =>
    HttpResponse.json(customersWithBalanceDue),
  ),
  http.get(`${backendUrl}/api/customers`, () => HttpResponse.json(customers)),
  http.get(`${backendUrl}/api/sales-invoices`, () => HttpResponse.json(salesInvoices)),
  http.get(`${backendUrl}/api/posted-sales-invoices`, () =>
    HttpResponse.json(postedSalesInvoices),
  ),
]
