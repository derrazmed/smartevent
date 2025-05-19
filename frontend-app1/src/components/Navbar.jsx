import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import '../styles/Navbar.css'; // Custom styles here

function AppNavbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate({
        pathname: '/events',
        search: `?search=${encodeURIComponent(searchTerm.trim())}`,
      });      
      setSearchTerm('');
    }
  };

  return (
    <Navbar expand="lg" className="custom-navbar shadow-sm" sticky="top">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-dark">
          🎉 EventManager
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/events" className="text-dark">
              Events
            </Nav.Link>
          </Nav>

          <Form className="d-flex me-3" onSubmit={handleSearchSubmit}>
            <FormControl
              type="search"
              placeholder="Search events"
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search events"
            />
            <Button variant="outline-primary" type="submit">
              Search
            </Button>
          </Form>

          <Nav>
            {user ? (
              <NavDropdown
                title={
                  <span className="text-dark">
                    <i className="bi bi-person-circle me-1"></i>
                    {user.fullName}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">My Profile</NavDropdown.Item>
                {user.isAdmin && (
                  <NavDropdown.Item as={Link} to="/admin">Admin Dashboard</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-dark">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
