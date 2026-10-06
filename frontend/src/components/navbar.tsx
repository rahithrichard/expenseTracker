import { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import navData from '../data/navData.json';
import { useAuth } from '../auth/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

function NavigationBar() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<'notifications' | 'profile' | null>(null);
  const navbarRef = useRef<HTMLElement>(null);
  const profileName = user?.name || user?.email || 'Account';

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpenMenu(null);
    navigate('/', { replace: true });
  };

  return (
    <Navbar ref={navbarRef} className="app-navbar" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Expense Tracker
        </Navbar.Brand>

        <Nav className="navbar-main-nav">
          {navData.map((item) => (
            <Nav.Link
              key={item.path}
              as={NavLink}
              to={item.path}
              end
            >
              {item.label}
            </Nav.Link>
          ))}
        </Nav>

        <div className="navbar-actions">
          <div className="navbar-menu">
            <button
              className="navbar-icon-button"
              type="button"
              title="Notifications"
              aria-label="Notifications"
              aria-expanded={openMenu === 'notifications'}
              onClick={() => setOpenMenu(openMenu === 'notifications' ? null : 'notifications')}
            >
              <span aria-hidden="true">🔔</span>
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </button>

            {openMenu === 'notifications' && (
              <div className="navbar-dropdown notification-dropdown" role="dialog" aria-label="Notifications">
                <div className="navbar-dropdown-heading">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <button className="notification-mark-all" type="button" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="notification-empty">You are all caught up.</div>
                  ) : notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      className={`notification-item ${notification.unread ? 'unread' : 'read'}`}
                      disabled={!notification.unread}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <span className="notification-type">
                        {notification.type === 'welcome' ? '👋' : notification.type === 'budget' ? '💵' : '⚠'}
                      </span>
                      <span className="notification-copy">
                        <strong>{notification.title}</strong>
                        <span>{notification.message}</span>
                      </span>
                      {notification.unread && <span className="notification-unread-dot" aria-label="Unread" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="navbar-menu">
            <button
              className="navbar-profile-button"
              type="button"
              title="Profile"
              aria-label="Profile"
              aria-expanded={openMenu === 'profile'}
              onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')}
            >
              <span className="profile-icon" aria-hidden="true">👤</span>
              <span>{profileName}</span>
            </button>

            {openMenu === 'profile' && (
              <div className="navbar-dropdown profile-dropdown" role="dialog" aria-label="Profile menu">
                <div className="profile-menu-header">
                  <span className="profile-icon" aria-hidden="true">👤</span>
                  <strong>{profileName}</strong>
                </div>
                <button className="navbar-logout-button" type="button" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;