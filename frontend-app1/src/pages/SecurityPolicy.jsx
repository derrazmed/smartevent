import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function SecurityPolicy() {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm p-4">
            <Card.Body>
              <Card.Title className="mb-4 text-center">Security Policy</Card.Title>
              
              <Card.Text>
                At <strong>EventManager</strong>, your security and privacy are our top priorities.
              </Card.Text>

              <h5>Data Protection</h5>
              <Card.Text>
                We use encrypted connections (HTTPS) for all data transmissions. Passwords are stored securely with hashing algorithms to ensure they are never saved in plain text.
              </Card.Text>

              <h5>User Privacy</h5>
              <Card.Text>
                We do not share your personal information with third parties without your consent. You remain in control of the data you choose to share.
              </Card.Text>

              <h5>Account Security</h5>
              <Card.Text>
                We encourage users to create strong passwords and change them regularly. Please contact support immediately if you suspect unauthorized activity.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SecurityPolicy;
