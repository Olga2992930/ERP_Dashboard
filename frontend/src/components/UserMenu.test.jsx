import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserMenu from './UserMenu.jsx'

const currentUser = {
  name: 'Taylor Tester',
  email: 'taylor@example.com',
  picture: '/avatar.png',
}

afterEach(cleanup)

function menuProps(overrides = {}) {
  return {
    currentUser,
    currentUserError: null,
    onRetryCurrentUser: vi.fn(),
    logoutUrl: '/logout?returnTo=%2F',
    logoutUrlError: null,
    onRetryLogoutUrl: vi.fn(),
    onLogout: vi.fn(),
    ...overrides,
  }
}

describe('UserMenu', () => {
  it('shows independent loading states for the current user and logout URL', () => {
    render(<UserMenu {...menuProps({ currentUser: null, logoutUrl: null })} />)

    expect(screen.getByText('Loading user...')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toHaveClass('user-action-loading')
    expect(screen.queryByRole('button', { name: 'Log out' })).not.toBeInTheDocument()
  })

  it('renders both request errors and retries the corresponding request', async () => {
    const user = userEvent.setup()
    const onRetryCurrentUser = vi.fn()
    const onRetryLogoutUrl = vi.fn()

    render(
      <UserMenu
        {...menuProps({
          currentUser: null,
          currentUserError: 'User profile is unavailable',
          onRetryCurrentUser,
          logoutUrl: null,
          logoutUrlError: 'Logout is unavailable',
          onRetryLogoutUrl,
        })}
      />,
    )

    const alerts = screen.getAllByRole('alert')
    expect(alerts).toHaveLength(2)
    expect(alerts[0]).toHaveTextContent('User profile is unavailable')
    expect(alerts[1]).toHaveTextContent('Logout is unavailable')
    expect(screen.queryByRole('button', { name: 'Log out' })).not.toBeInTheDocument()

    await user.click(within(alerts[0]).getByRole('button', { name: 'Retry' }))
    await user.click(within(alerts[1]).getByRole('button', { name: 'Retry' }))

    expect(onRetryCurrentUser).toHaveBeenCalledOnce()
    expect(onRetryLogoutUrl).toHaveBeenCalledOnce()
  })

  it('shows the profile and passes the resolved URL to the logout handler', async () => {
    const user = userEvent.setup()
    const onLogout = vi.fn()
    const props = menuProps({ onLogout })
    const { container } = render(<UserMenu {...props} />)

    expect(screen.getByText('Taylor Tester')).toBeInTheDocument()
    expect(screen.getByText('taylor@example.com')).toBeInTheDocument()

    container.querySelector('details').open = true
    await user.click(screen.getByRole('button', { name: 'Log out' }))

    expect(onLogout).toHaveBeenCalledOnce()
    expect(onLogout).toHaveBeenCalledWith(props.logoutUrl)
  })

  it('falls back to the user initial when avatar images fail to load', () => {
    const { container } = render(<UserMenu {...menuProps()} />)

    const avatarImages = [...container.querySelectorAll('.user-avatar img')]
    expect(avatarImages).toHaveLength(2)

    avatarImages.forEach((avatarImage) => fireEvent.error(avatarImage))

    expect(container.querySelectorAll('.user-avatar img')).toHaveLength(0)
    expect(container.querySelector('.user-avatar--small')).toHaveTextContent('T')
    expect(container.querySelector('.user-avatar--large')).toHaveTextContent('T')
  })

  it('keeps the menu open for inside pointer events and closes it on an outside pointer event', () => {
    const { container } = render(<UserMenu {...menuProps()} />)
    const menu = container.querySelector('details')
    menu.open = true

    fireEvent.pointerDown(screen.getByText('Taylor Tester'))
    expect(menu).toHaveAttribute('open')

    fireEvent.pointerDown(document.body)
    expect(menu).not.toHaveAttribute('open')
  })
})
