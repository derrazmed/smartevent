// Ce composant représente la page "Contact" de l'application EventManager.
// Il contient un formulaire permettant aux utilisateurs d'envoyer un message de contact.

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';

function Contact() {
  // État pour stocker les données du formulaire
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // État pour savoir si le formulaire a été soumis avec succès
  const [submitted, setSubmitted] = useState(false);

  // Mise à jour des champs du formulaire lors de la saisie
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, on pourrait ajouter une logique pour envoyer les données vers un backend
    setSubmitted(true);
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Title className="mb-4 text-center">Contactez-nous</Card.Title>

              {/* Si le formulaire a été soumis, afficher un message de succès */}
              {submitted ? (
                <Alert variant="success">
                  Merci de nous avoir contactés ! Nous reviendrons vers vous très bientôt.
                </Alert>
              ) : (
                // Formulaire de contact
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="contactName">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez votre nom"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="contactEmail">
                    <Form.Label>Adresse e-mail</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Entrez votre adresse e-mail"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="contactMessage">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Écrivez votre message ici"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <div className="text-center">
                    <Button variant="primary" type="submit">
                      Envoyer le message
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;
