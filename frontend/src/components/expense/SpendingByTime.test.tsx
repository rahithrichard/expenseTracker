import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SpendingByTime from './SpendingByTime'

describe('SpendingByTime', () => {
  it('aggregates expenses and switches the chart period', () => {
    render(
      <SpendingByTime
        expenses={[
          { id: '1', title: 'Lunch', amount: 20, category: 'Food', date: '2026-10-02' },
          { id: '2', title: 'Train', amount: 10, category: 'Transport', date: '2026-10-02' },
        ]}
      />,
    )

    expect(screen.getByText('$30')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Day' }))
    expect(screen.getByText('Oct 2')).toBeInTheDocument()
  })

  it('shows an empty state when no expenses exist', () => {
    render(<SpendingByTime expenses={[]} />)

    expect(screen.getByText('Add an expense to see spending trends.')).toBeInTheDocument()
  })
})
