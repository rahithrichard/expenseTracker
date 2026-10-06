import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type NotificationType = 'welcome' | 'budget' | 'balance'

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: NotificationType
  unread: boolean
  createdAt?: string
}

type NotificationInput = Omit<NotificationItem, 'id' | 'createdAt' | 'unread'> & {
  id?: string
  unread?: boolean
}

interface NotificationContextValue {
  notifications: NotificationItem[]
  unreadCount: number
  addNotification: (notification: NotificationInput) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const STORAGE_KEY = 'expense-tracker-notifications'
const NotificationContext = createContext<NotificationContextValue | null>(null)

const defaultNotification = (
  title: string,
  message: string,
  type: NotificationType,
): Omit<NotificationItem, 'id' | 'createdAt'> => ({
  title,
  message,
  type,
  unread: true,
})

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) as NotificationItem[] : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  const addNotification = useCallback((notification: NotificationInput) => {
    const item: NotificationItem = {
      ...notification,
      id: notification.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      unread: true,
    }
    setNotifications((current) => [item, ...current].slice(0, 50))
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((current) => current.map((item) =>
      item.id === id ? { ...item, unread: false } : item,
    ))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })))
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const value = useMemo(() => ({
    notifications,
    unreadCount: notifications.filter((notification) => notification.unread).length,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  }), [notifications, addNotification, markAsRead, markAllAsRead, clearNotifications])

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used inside NotificationProvider')
  }
  return context
}

export function createWelcomeNotification(name: string) {
  return defaultNotification(
    'Welcome to Expense Tracker',
    `Welcome, ${name}. Your expense dashboard is ready.`,
    'welcome',
  )
}

export function createBudgetNotification(amount: number) {
  return defaultNotification(
    'Budget added',
    `$${Number(amount).toFixed(2)} was added to your monthly budget.`,
    'budget',
  )
}

export function createLowBalanceNotification(remaining: number) {
  return defaultNotification(
    'Low balance',
    `Your remaining balance is $${Number(remaining).toFixed(2)}. Add funds or review spending.`,
    'balance',
  )
}
