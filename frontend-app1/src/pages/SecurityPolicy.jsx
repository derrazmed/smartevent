import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function SecurityPolicy() {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Title className="mb-4 text-center">Politique de confidentialité</Card.Title>
              
              <Card.Text>
                Chez <strong>EventManager</strong>, votre sécurité et votre confidentialité sont nos priorités absolues.
              </Card.Text>

              <h5>Protection des données</h5>
              <Card.Text>
                Nous utilisons des connexions chiffrées (HTTPS) pour toutes les transmissions de données. Les mots de passe sont stockés de manière sécurisée grâce à des algorithmes de hachage, et ne sont jamais enregistrés en clair.
              </Card.Text>

              <h5>Vie privée des utilisateurs</h5>
              <Card.Text>
                Nous ne partageons pas vos informations personnelles avec des tiers sans votre consentement. Vous gardez le contrôle sur les données que vous choisissez de partager.
              </Card.Text>

              <h5>Sécurité des comptes</h5>
              <Card.Text>
                Nous recommandons aux utilisateurs de créer des mots de passe forts et de les changer régulièrement. Veuillez contacter le support immédiatement si vous suspectez une activité non autorisée.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SecurityPolicy;
