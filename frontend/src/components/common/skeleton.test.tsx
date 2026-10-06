import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SkeletonComponent from './skeleton'

describe('SkeletonComponent', () => {
  it('renders the requested number of skeleton cards', () => {
    const { container } = render(<SkeletonComponent count={3} />)

    expect(container.querySelectorAll('.skeleton-card')).toHaveLength(3)
    expect(screen.queryByText('Loading')).not.toBeInTheDocument()
  })
})
