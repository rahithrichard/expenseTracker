import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';
import navData from "../data/navData.json";

function NavigationBar() {
  // const handleLogout = () => {
  //   localStorage.removeItem("loginStore");
  // };

  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          Expense Tracker
        </Navbar.Brand>

        <Nav className="me-auto">
          {navData.map((item) => (
            <Nav.Link
              key={item.path}
              as={NavLink}
              to={item.path}
            >
              {item.label}
            </Nav.Link>
          ))}
        </Nav>

        {/* <Nav.Link
          className="nav-logout"
          as={NavLink}
          to="/"
          onClick={handleLogout}
        >
          Logout <span className="logout-icon">&#x1F519;</span>
        </Nav.Link> */}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;