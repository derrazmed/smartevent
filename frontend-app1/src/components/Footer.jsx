import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="custom-footer mt-auto">
      <Container>
        <Row className="py-4 text-center text-md-start">
          <Col md={4} className="mb-3 mb-md-0">
            <h5 className="footer-title">EventManager</h5>
            <p className="small mb-0">
              &copy; {new Date().getFullYear()} EventManager. All rights reserved.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/about" className="footer-link">About</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li><Link to="/security-policy" className="footer-link">Privacy Policy</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="footer-heading">Follow Us</h6>
            <div className="d-flex justify-content-center justify-content-md-start gap-3">
              <a href="https://facebook.com" className="footer-icon"><FaFacebook size={22} /></a>
              <a href="https://twitter.com" className="footer-icon"><FaTwitter size={22} /></a>
              <a href="https://instagram.com" className="footer-icon"><FaInstagram size={22} /></a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
