import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SpendByCategory from './SpendByCategory'

describe('SpendByCategory', () => {
  it('renders the total and category percentages', () => {
    render(
      <SpendByCategory data={[
        { category: 'Food', total: 60 },
        { category: 'Transport', total: 40 },
      ]} />,
    )

    expect(screen.getByRole('heading', { name: 'Spend by Category' })).toBeInTheDocument()
    expect(screen.getByLabelText('Total spend $100.00')).toBeInTheDocument()
    expect(screen.getByText('Food')).toBeInTheDocument()
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('renders an empty chart state for no data', () => {
    render(<SpendByCategory data={[]} />)

    expect(screen.getByLabelText('Total spend $0.00')).toBeInTheDocument()
    expect(screen.queryByText('No data')).not.toBeInTheDocument()
  })
})
