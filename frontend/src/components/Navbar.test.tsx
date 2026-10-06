import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Navbar from './Navbar'
import { NotificationProvider } from '../contexts/NotificationContext'

vi.mock('../auth/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    logout: vi.fn(),
  }),
}))

const renderNavbar = () => render(
  <MemoryRouter>
    <NotificationProvider>
      <Navbar />
    </NotificationProvider>
  </MemoryRouter>,
)

describe('Navbar', () => {
  beforeEach(() => localStorage.clear())

  it('renders navigation and exposes notifications', () => {
    renderNavbar()

    expect(screen.getByRole('link', { name: 'Expense Tracker' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
    expect(screen.getByText('You are all caught up.')).toBeInTheDocument()
  })

  it('shows the profile name and logout action', () => {
    renderNavbar()

    fireEvent.click(screen.getByRole('button', { name: 'Profile' }))
    expect(screen.getAllByText('Test User')).toHaveLength(2)
    expect(screen.getByRole('button', { name: 'Log out' })).toBeInTheDocument()
  })

  it('closes an open menu when clicking outside', () => {
    renderNavbar()

    fireEvent.click(screen.getByRole('button', { name: 'Profile' }))
    fireEvent.mouseDown(document.body)

    expect(screen.queryByRole('dialog', { name: 'Profile menu' })).not.toBeInTheDocument()
  })
})
