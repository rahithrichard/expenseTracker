import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SpendingByTimeSkeleton from './SpendingByTimeSkeleton'

describe('SpendingByTimeSkeleton', () => {
  it('renders the configured number of chart bars', () => {
    const { container } = render(<SpendingByTimeSkeleton count={5} />)

    expect(container.querySelectorAll('.time-chart-bar-group')).toHaveLength(5)
  })
})
