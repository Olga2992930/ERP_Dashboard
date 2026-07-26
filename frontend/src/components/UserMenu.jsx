import { useEffect, useRef, useState } from 'react'
import LoadError from './LoadError.jsx'
import { useLanguage } from '../i18n.jsx'

function UserAvatar({ user, size }) {
  const [failedPicture, setFailedPicture] = useState(null)
  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U'
  const showPicture = user?.picture && failedPicture !== user.picture

  return (
    <span className={`user-avatar user-avatar--${size}`} aria-hidden="true">
      {showPicture ? (
        <img src={user.picture} alt="" onError={() => setFailedPicture(user.picture)} />
      ) : (
        userInitial
      )}
    </span>
  )
}

function UserMenu({
  currentUser,
  currentUserError,
  onRetryCurrentUser,
  logoutUrl,
  logoutUrlError,
  onRetryLogoutUrl,
  onLogout,
}) {
  const { t } = useLanguage()
  const menuRef = useRef(null)

  useEffect(() => {
    const closeMenuOnOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        menuRef.current.removeAttribute('open')
      }
    }

    document.addEventListener('pointerdown', closeMenuOnOutsideClick)

    return () => document.removeEventListener('pointerdown', closeMenuOnOutsideClick)
  }, [])

  return (
    <details className="user-menu" ref={menuRef}>
      <summary className="user-menu-trigger" aria-label={t('Account')}>
        <UserAvatar user={currentUser} size="small" />
        <strong className="user-trigger-label">{t('Account')}</strong>
      </summary>

      <div className="user-popover">
        <div className="user-popover-header">
          <span>{t('Current user')}</span>
          {logoutUrlError ? null : logoutUrl === null ? (
            <span className="user-action-loading">{t('Loading...')}</span>
          ) : (
            <button className="profile-logout" type="button" onClick={() => onLogout(logoutUrl)}>
              {t('Log out')}
            </button>
          )}
        </div>

        {currentUserError ? (
          <LoadError message={currentUserError} onRetry={onRetryCurrentUser} compact />
        ) : currentUser === null ? (
          <p className="loading-copy">{t('Loading user...')}</p>
        ) : (
          <div className="user-profile">
            <UserAvatar user={currentUser} size="large" />
            <div className="user-profile-copy">
              <strong>{currentUser.name}</strong>
              <span>{currentUser.email}</span>
            </div>
          </div>
        )}

        {logoutUrlError && (
          <LoadError message={logoutUrlError} onRetry={onRetryLogoutUrl} compact />
        )}
      </div>
    </details>
  )
}

export default UserMenu
