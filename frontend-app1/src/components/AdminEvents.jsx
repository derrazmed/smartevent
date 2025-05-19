import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', category: 'music' });

  const fetchEvents = async () => {
    try {
      const res = await fetch('https://localhost:7237/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('https://localhost:7237/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        fetchEvents();
        setForm({ title: '', description: '', date: '', category: 'music' });
      } else {
        console.error('Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://localhost:7237/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  return (
    <>
      <Card className="mb-4 shadow">
        <Card.Body>
          <h4>Add New Event</h4>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Title"
                />
              </Col>
              <Col>
                <Form.Control
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="music">Music</option>
                  <option value="tech">Tech</option>
                  <option value="art">Art</option>
                  <option value="sports">Sports</option>
                  <option value="business">Business</option>
                </Form.Select>
              </Col>
              <Col>
                <Button variant="primary" onClick={handleCreate}>
                  Add Event
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mb-5 shadow">
        <Card.Body>
          <h4>Existing Events</h4>
          {events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <ListGroup>
              {events.map(ev => (
                <ListGroup.Item key={ev.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{ev.title}</strong> — {new Date(ev.date).toLocaleDateString()} — <em>{ev.category}</em>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(ev.id)}>
                    Delete
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default AdminEvents;
