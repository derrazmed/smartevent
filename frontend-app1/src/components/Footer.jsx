import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';

/**
 * Composant pied de page (Footer) du site.
 * 
 * Affiche :
 * - Le nom et la date actuelle
 * - Des liens rapides vers des pages importantes (À propos, Contact, Politique de confidentialité)
 * - Des icônes avec liens vers les réseaux sociaux (Facebook, Twitter, Instagram)
 * 
 * Utilise Bootstrap pour la mise en page responsive.
 */
function Footer() {
  return (
    <footer className="custom-footer mt-auto">
      <Container>
        <Row className="py-4 text-center text-md-start">
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="footer-title">EventManager</h5>
            <p className="small mb-0">
              &copy; {new Date().getFullYear()} EventManager. Tous droits réservés.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="footer-heading">Liens rapides</h6>
            <ul className="list-unstyled">
              <li><Link to="/about" className="footer-link">À propos</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li><Link to="/security-policy" className="footer-link">Politique de confidentialité</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="footer-heading">Suivez-nous</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="https://facebook.com" className="footer-icon" aria-label="Facebook"><FaFacebook size={22} /></a>
              <a href="https://twitter.com" className="footer-icon" aria-label="Twitter"><FaTwitter size={22} /></a>
              <a href="https://instagram.com" className="footer-icon" aria-label="Instagram"><FaInstagram size={22} /></a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
