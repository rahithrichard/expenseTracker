import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ConfirmPopup from './Popup'

describe('ConfirmPopup', () => {
  it('renders the confirmation message and invokes the selected action', () => {
    const onConfirm = vi.fn()
    const onCancel = vi.fn()
    render(
      <ConfirmPopup
        isOpen
        title="Delete expense?"
        message="This action cannot be undone."
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Delete expense?' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Yes' }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('returns nothing when closed', () => {
    const { container } = render(
      <ConfirmPopup isOpen={false} title="Delete" message="Confirm" onConfirm={vi.fn()} onCancel={vi.fn()} />,
    )

    expect(container.firstChild).toBeNull()
  })
})
