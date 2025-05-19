import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function About() {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Title className="mb-4 text-center">About EventManager</Card.Title>
              <Card.Text>
                Welcome to <strong>EventManager</strong>! Our platform provides a seamless way to organize and attend events across various interests including music, tech, art, sports, and business.
              </Card.Text>
              <Card.Text>
                Our mission is to connect people through exciting events and to make event management effortless for organizers and attendees alike.
              </Card.Text>
              <Card.Text>
                Whether you want to discover new experiences or manage your own event, EventManager is here to simplify your journey.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
