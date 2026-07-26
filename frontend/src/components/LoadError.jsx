import { useLanguage } from '../i18n.jsx'

function LoadError({ message, onRetry, compact = false }) {
  const { t } = useLanguage()
  return (
    <div className={`error-state${compact ? ' error-state--compact' : ''}`} role="alert">
      <p>{t(message)}</p>
      <button className="button button--retry" type="button" onClick={onRetry}>
        {t('Retry')}
      </button>
    </div>
  )
}

export default LoadError
