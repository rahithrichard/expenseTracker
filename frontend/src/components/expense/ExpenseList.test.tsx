import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ExpenseList from './ExpenseList'

describe('ExpenseList', () => {
  it('renders meaningful icons for each summary category', () => {
    render(
      <ExpenseList
        data={[
          { category: 'total', total: 120 },
          { category: 'budget', total: 200 },
          { category: 'remaining', total: 80 },
        ]}
      />,
    )

    expect(screen.getByText('💰')).toBeInTheDocument()
    expect(screen.getByText('💳')).toBeInTheDocument()
    expect(screen.getByText('↗')).toBeInTheDocument()
  })

  it('renders a fallback icon for an unknown category', () => {
    render(<ExpenseList data={[{ category: 'unknown', total: 10 }]} />)

    expect(screen.getByText('◇')).toBeInTheDocument()
  })
})
