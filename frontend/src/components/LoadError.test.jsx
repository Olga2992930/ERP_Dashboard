import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import LoadError from './LoadError.jsx'

describe('LoadError', () => {
  it('announces the error and calls onRetry when Retry is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(<LoadError message="Could not load customers." onRetry={onRetry} />)

    const alert = screen.getByRole('alert')
    expect(within(alert).getByText('Could not load customers.')).toBeInTheDocument()

    await user.click(within(alert).getByRole('button', { name: 'Retry' }))

    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('uses the compact error style when requested', () => {
    render(<LoadError message="Could not load." onRetry={() => {}} compact />)

    expect(screen.getByRole('alert')).toHaveClass('error-state', 'error-state--compact')
  })
})
