import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { NotificationProvider } from '../contexts/NotificationContext'
import NavigationBar from './Navbar'

vi.mock('../auth/AuthContext', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    logout: vi.fn(),
  }),
}))

describe('Navigation notifications', () => {
  it('renders the notification control with the provider', () => {
    render(
      <MemoryRouter>
        <NotificationProvider>
          <NavigationBar />
        </NotificationProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument()
  })
})
