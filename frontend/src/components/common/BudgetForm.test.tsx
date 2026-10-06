import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import BudgetForm from './BudgetForm'

describe('BudgetForm', () => {
  it('submits a valid monthly budget', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<BudgetForm budget={{ monthStart: '2026-10-01', amount: 0 }} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '450' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add budget' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(450, '2026-10-01'))
    expect(screen.getByRole('button', { name: 'Add budget' })).toBeEnabled()
  })

  it('shows an error when the update fails', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Budget unavailable'))
    render(<BudgetForm budget={{ monthStart: '2026-10-01', amount: 100 }} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '120' } })
    fireEvent.click(screen.getByRole('button', { name: 'Update budget' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Budget unavailable')
  })
})
