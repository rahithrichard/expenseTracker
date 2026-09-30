import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import navData from "../data/navData.json";
import { useAuth } from '../auth/AuthContext';

const notifications = [
  { id: 1, title: 'Budget reminder', message: 'Review your spending for this month.' },
  { id: 2, title: 'Expense tracker', message: 'Your latest transactions are up to date.' },
];

function NavigationBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<'notifications' | 'profile' | null>(null);
  const profileName = user?.name || user?.email || 'Account';

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <Navbar className="app-navbar" data-bs-theme="dark">
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
              <span aria-hidden="true">&#128276;</span>
              <span className="notification-badge">{notifications.length}</span>
            </button>
            {openMenu === 'notifications' && (
              <div className="navbar-dropdown notification-dropdown">
                <div className="navbar-dropdown-heading">Notifications</div>
                {notifications.map((notification) => (
                  <div className="notification-item" key={notification.id}>
                    <strong>{notification.title}</strong>
                    <span>{notification.message}</span>
                  </div>
                ))}
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
              <span className="profile-icon" aria-hidden="true">&#128100;</span>
              <span>{profileName}</span>
            </button>
            {openMenu === 'profile' && (
              <div className="navbar-dropdown profile-dropdown">
                <strong>{profileName}</strong>
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