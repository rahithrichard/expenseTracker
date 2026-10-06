import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { NotificationProvider, useNotifications } from './NotificationContext'

function TestConsumer() {
  const { notifications, unreadCount, addNotification, markAsRead } = useNotifications()

  return (
    <div>
      <span>{unreadCount}</span>
      {notifications.map((notification) => (
        <button
          key={notification.id}
          type="button"
          onClick={() => markAsRead(notification.id)}
        >
          {notification.title}: {notification.message}
        </button>
      ))}
      <button
        type="button"
        onClick={() => addNotification({
          id: 'test-notification',
          title: 'Test',
          message: 'Test message',
          type: 'welcome',
          unread: true,
        })}
      >
        Add notification
      </button>
    </div>
  )
}

describe('NotificationContext', () => {
  beforeEach(() => localStorage.clear())

  it('persists notifications and tracks unread count', () => {
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Add notification' }))
    expect(screen.getByText('Test: Test message')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Test: Test message' }))
    expect(screen.getByText('0')).toBeInTheDocument()
  })
})
