import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Banner from './Banner'

describe('Banner', () => {
  it('renders the application title and description', () => {
    render(<Banner />)

    expect(screen.getByRole('heading', { name: 'Expense Tracker' })).toBeInTheDocument()
    expect(screen.getByText('Track your expenses and manage your budget effectively.')).toBeInTheDocument()
  })
})
