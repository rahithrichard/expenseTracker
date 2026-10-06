import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import expenseColumns from '../../types/expenseColumn'
import ExpenseTable from './ExpenseTable'

describe('ExpenseTable', () => {
  it('filters expenses by search and category', () => {
    render(
      <ExpenseTable
        data={[
          { id: '1', title: 'Lunch', amount: 20, category: 'Food', date: '2026-10-02' },
          { id: '2', title: 'Train', amount: 10, category: 'Transport', date: '2026-10-03' },
        ]}
        columns={expenseColumns}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'train' } })
    expect(screen.getByText('Train')).toBeInTheDocument()
    expect(screen.queryByText('Lunch')).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }))
    fireEvent.change(screen.getByLabelText('Category'), { target: { value: 'Food' } })
    expect(screen.getByText('Lunch')).toBeInTheDocument()
    expect(screen.queryByText('Train')).not.toBeInTheDocument()
  })

  it('calls edit and delete callbacks', () => {
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    render(
      <ExpenseTable
        data={[{ id: '1', title: 'Lunch', amount: 20, category: 'Food', date: '2026-10-02' }]}
        columns={expenseColumns}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }))
    expect(onDelete).toHaveBeenCalledWith('1')
  })
})
