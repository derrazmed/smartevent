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
import '../styles/Navbar.css'; // Styles personnalisés

/**
 * Composant barre de navigation principale de l'application.
 *
 * Fonctionnalités :
 * - Affichage du nom de l'app avec lien vers la page d'accueil.
 * - Lien vers la page des événements.
 * - Barre de recherche pour filtrer les événements.
 * - Gestion de l’état de l’utilisateur connecté :
 *    - Si connecté : affichage du nom, lien vers profil, tableau de bord admin si admin, et déconnexion.
 *    - Si non connecté : affichage du lien vers la page de connexion.
 * - Gestion de la déconnexion.
 * - Redirection sur résultats de recherche d'événements.
 */
function AppNavbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Déconnexion : suppression du user du localStorage et mise à jour du contexte, puis redirection vers login
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Soumission du formulaire de recherche : redirection vers /events avec paramètre search
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
          🎉 Gestionnaire d’Événements
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/events" className="text-dark">
              Événements
            </Nav.Link>
          </Nav>

          <Form className="d-flex me-3" onSubmit={handleSearchSubmit}>
            <FormControl
              type="search"
              placeholder="Rechercher des événements"
              className="me-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Rechercher des événements"
            />
            <Button variant="outline-primary" type="submit">
              Rechercher
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
                <NavDropdown.Item as={Link} to="/profile">Mon Profil</NavDropdown.Item>
                {user.isAdmin && (
                  <NavDropdown.Item as={Link} to="/admin">Tableau de Bord Admin</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Déconnexion</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login" className="text-dark">
                Connexion
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
