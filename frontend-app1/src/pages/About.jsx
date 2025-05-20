// Ce composant React affiche une page "À propos" pour l'application EventManager.
// Il utilise React-Bootstrap pour la mise en page et le style.

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function About() {
  return (
    <Container className="my-5">
      {/* Ligne centrée contenant une colonne principale */}
      <Row className="justify-content-center">
        <Col md={8}>
          {/* Carte d'information avec ombrage et padding */}
          <Card className="shadow-sm p-4">
            <Card.Body>
              {/* Titre centré de la carte */}
              <Card.Title className="mb-4 text-center">À propos de EventManager</Card.Title>
              
              {/* Texte de présentation de la plateforme */}
              <Card.Text>
                Bienvenue sur <strong>EventManager</strong> ! Notre plateforme offre un moyen fluide d’organiser et de participer à des événements dans divers domaines tels que la musique, la technologie, l’art, le sport et les affaires.
              </Card.Text>

              <Card.Text>
                Notre mission est de connecter les personnes à travers des événements passionnants et de rendre la gestion d'événements simple pour les organisateurs comme pour les participants.
              </Card.Text>

              <Card.Text>
                Que vous souhaitiez découvrir de nouvelles expériences ou gérer vos propres événements, EventManager est là pour simplifier votre parcours.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
