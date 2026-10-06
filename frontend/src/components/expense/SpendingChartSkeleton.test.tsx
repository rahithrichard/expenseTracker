import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SpendingChartSkeleton from './SpendingChartSkeleton'

describe('SpendingChartSkeleton', () => {
  it('renders the configured number of legend rows', () => {
    const { container } = render(<SpendingChartSkeleton count={4} />)

    expect(container.querySelectorAll('.legend-skeleton-row')).toHaveLength(4)
  })
})
