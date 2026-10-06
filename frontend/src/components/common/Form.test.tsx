import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import ExpenseForm from './Form'

describe('ExpenseForm', () => {
  it('submits a new expense through the component callback', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    render(<ExpenseForm availableBalance={500} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Coffee' } })
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '5.50' } })
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Food' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add expense' }))

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Coffee', amount: 5.5, category: 'Food' }),
    ))
  })

  it('shows an error when the save operation fails', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Save failed'))
    render(<ExpenseForm availableBalance={100} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Lunch' } })
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '20' } })
    fireEvent.click(screen.getByRole('button', { name: 'Add expense' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Save failed')
  })
})
