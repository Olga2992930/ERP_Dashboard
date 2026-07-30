/* eslint-disable react/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'

const swedish = {
  'Welcome back': 'Välkommen tillbaka', 'Here is today\'s business overview.': 'Här är dagens affärsöversikt.',
  'Live data': 'Live-data', 'Updated from Business Central': 'Uppdaterat från Business Central',
  'Main menu': 'Huvudmeny', Overview: 'Översikt', Customers: 'Kunder', 'Sales invoices': 'Kundfakturor',
  'Posted invoices': 'Bokförda fakturor', Receivables: 'Kundfordringar', 'Log out': 'Logga ut', Account: 'Konto',
  Analytics: 'Analys', 'Dashboard overview': 'Dashboardöversikt',
  'Customers, invoice performance and receivables at a glance.': 'Kunder, fakturor och kundfordringar i korthet.',
  'Customer overview': 'Kundöversikt', 'Customer base and outstanding receivables.': 'Kundbas och utestående kundfordringar.',
  'Current invoice performance': 'Aktuell fakturastatus', 'Open invoices, remaining amounts and tax totals.': 'Öppna fakturor, återstående belopp och moms.',
  'Posted invoice totals': 'Bokförda fakturabelopp', 'Finalized invoice volume and value from Business Central.': 'Bokförd fakturavolym och värde från Business Central.',
  'Customer receivables': 'Kundfordringar', 'Customers with an outstanding balance due.': 'Kunder med utestående saldo.',
  'Balance due': 'Utestående saldo', 'Open invoices': 'Öppna fakturor', 'Business Central': 'Business Central',
  'Customers with balance due': 'Kunder med utestående saldo', 'Total balance due': 'Totalt utestående saldo',
  'Average balance due': 'Genomsnittligt saldo', 'Largest balance due': 'Största utestående saldo',
  Invoices: 'Fakturor', 'Remaining amount': 'Återstående belopp', 'Total excluding tax': 'Totalt exklusive moms',
  'Total tax': 'Total moms', 'Total including tax': 'Totalt inklusive moms', 'Posted invoice details': 'Detaljer för bokförda fakturor',
  'Sales invoice details': 'Fakturadetaljer', 'View details': 'Visa detaljer', 'Loading details...': 'Laddar detaljer...',
  'No matching records': 'Inga matchande poster', records: 'poster', Number: 'Nummer', Customer: 'Kund', Date: 'Datum',
  'Due date': 'Förfallodatum', Remaining: 'Återstående', Total: 'Totalt', Email: 'E-post', 'Credit limit': 'Kreditgräns', Currency: 'Valuta',
  'Records used to calculate this KPI in Business Central.': 'Poster som används för att beräkna detta KPI i Business Central.',
  'Invoices used to calculate the selected KPI.': 'Fakturor som används för att beräkna valt KPI.',
  'Posted invoices used to calculate the selected KPI.': 'Bokförda fakturor som används för att beräkna valt KPI.',
  'Accounts that currently require payment follow-up.': 'Konton som behöver betalningsuppföljning.',
  'Loading customers...': 'Laddar kunder...', 'All clear': 'Allt klart', 'No customers have a balance due.': 'Inga kunder har ett utestående saldo.',
  'Current user': 'Aktuell användare', 'Loading...': 'Laddar...', 'Loading user...': 'Laddar användare...', Retry: 'Försök igen',
  'Preparing secure login...': 'Förbereder säker inloggning...', 'Log in with Google': 'Logga in med Google',
  Language: 'Språk', English: 'Engelska', Swedish: 'Svenska',
  'This dashboard uses sample data from the CRONUS SE demo company:': 'Denna dashboard använder exempeldata från demoföretaget CRONUS SE:',
  'Customers and outstanding balances': 'Kunder och utestående saldon',
  'No real company or customer data is used.': 'Inga riktiga företags- eller kunduppgifter används.',
  'Could not load current user.': 'Det gick inte att läsa in den aktuella användaren.',
  'Could not load customer KPI.': 'Det gick inte att läsa in kund-KPI.',
  'Could not load sales invoice KPI.': 'Det gick inte att läsa in KPI för kundfakturor.',
  'Could not load posted sales invoice KPI.': 'Det gick inte att läsa in KPI för bokförda fakturor.',
  'Could not load customers with balance due.': 'Det gick inte att läsa in kunder med utestående saldo.',
  'Could not load customers.': 'Det gick inte att läsa in kunder.',
  'Could not load sales invoices.': 'Det gick inte att läsa in kundfakturor.',
  'Could not load posted invoices.': 'Det gick inte att läsa in bokförda fakturor.',
  'Could not check authentication status.': 'Det gick inte att kontrollera inloggningsstatus.',
  'Could not load the login link.': 'Det gick inte att läsa in inloggningslänken.',
  'Could not load the logout link.': 'Det gick inte att läsa in utloggningslänken.',
  'Loading customer KPI...': 'Laddar kund-KPI...',
  'Loading sales invoice KPI...': 'Laddar KPI för kundfakturor...',
  'Loading posted sales invoice KPI...': 'Laddar KPI för bokförda fakturor...',
  'Key business indicators': 'Viktiga affärsindikatorer', 'Dashboard navigation': 'Dashboardnavigering',
  'Current workspace': 'Aktuell arbetsyta', details: 'detaljer',
  'Open {label} section': 'Öppna avsnittet {label}',
  Search: 'Sök', Filter: 'Filter', 'Search by number, customer or email': 'Sök på nummer, kund eller e-post',
  'All records': 'Alla poster', 'With balance due': 'Med utestående saldo', 'Without balance due': 'Utan utestående saldo',
  Open: 'Öppna', Closed: 'Stängda', 'All currencies': 'Alla valutor',
  'Try changing your search or filter.': 'Försök ändra sökningen eller filtret.',
}

const interpolate = (text, variables = {}) =>
  Object.entries(variables).reduce((result, [key, value]) => result.replace(`{${key}}`, value), text)

const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
  t: interpolate,
})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('erp-language') === 'sv' ? 'sv' : 'en')
  useEffect(() => { localStorage.setItem('erp-language', language); document.documentElement.lang = language }, [language])
  const t = (text, variables = {}) => {
    const translated = language === 'sv' ? (swedish[text] || text) : text
    return interpolate(translated, variables)
  }
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
