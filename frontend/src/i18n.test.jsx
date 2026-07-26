import { render, screen } from '@testing-library/react'
import { beforeEach, expect, it } from 'vitest'
import { LanguageProvider, useLanguage } from './i18n.jsx'

function TranslationProbe() {
  const { language, t } = useLanguage()
  return <div><span>{language}</span><span>{t('Could not load customers.')}</span><span>{t('Loading details...')}</span><span>{t('Open {label} section', { label: t('Customers') })}</span></div>
}

beforeEach(() => localStorage.clear())

it('translates errors, loading states, and dynamic labels into Swedish', () => {
  localStorage.setItem('erp-language', 'sv')
  render(<LanguageProvider><TranslationProbe /></LanguageProvider>)
  expect(screen.getByText('sv')).toBeInTheDocument()
  expect(screen.getByText('Det gick inte att läsa in kunder.')).toBeInTheDocument()
  expect(screen.getByText('Laddar detaljer...')).toBeInTheDocument()
  expect(screen.getByText('Öppna avsnittet Kunder')).toBeInTheDocument()
})
