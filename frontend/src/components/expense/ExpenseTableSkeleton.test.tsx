import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ExpenseTableSkeleton from './ExpenseTableSkeleton'

describe('ExpenseTableSkeleton', () => {
  it('renders the configured number of table rows', () => {
    const { container } = render(<ExpenseTableSkeleton count={3} />)

    expect(container.querySelectorAll('.table-skeleton-row')).toHaveLength(3)
  })
})
