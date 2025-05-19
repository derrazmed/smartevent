import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Form, InputGroup, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

function Events() {
  const location = useLocation();
  const navigate = useNavigate();
  const [appliedEventIds, setAppliedEventIds] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const query = new URLSearchParams(location.search);
  const searchParam = query.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user: userData } = useAuth();

  // Form data for application modal
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    paymentMethod: 'credit_card'
  });

  // Fetch events on search param change
  useEffect(() => {
    setSearchTerm(searchParam);
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://localhost:7237/api/events?search=${encodeURIComponent(searchParam)}`);
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [location.search, searchParam]);

  // Fetch user's applied events
  useEffect(() => {
    if (userData) {
      fetch(`https://localhost:7237/api/applications/user/${userData.id}`)
        .then(async res => {
          if (!res.ok) {
            if (res.status === 404) return [];
            const text = await res.text();
            throw new Error(text);
          }
          return res.json();
        })
        .then(data => {
          const uniqueEventIds = [...new Set(data.map(app => app.eventId))];
          setAppliedEventIds(uniqueEventIds);
        })
        .catch(err => console.error('Failed to fetch applications:', err.message));
    } else {
      setAppliedEventIds([]);
    }
  }, [userData]);

  const handleApply = (event) => {
    if (!userData) {
      alert("Please log in to apply for an event.");
      return;
    }
    setSelectedEvent(event);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData || !selectedEvent) return;

    const application = {
      userId: userData.id,
      eventId: selectedEvent.id,
      fullName: userData.fullName,
      email: userData.email,
      phone: formData.phone,
      address: formData.address,
      paymentMethod: formData.paymentMethod,
    };

    try {
      const response = await fetch('https://localhost:7237/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application)
      });

      if (response.ok) {
        setAppliedEventIds(prev => [...prev, selectedEvent.id]);
        setSelectedEvent(null);
        setFormData({ phone: '', address: '', paymentMethod: 'credit_card' });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Update URL with new search param on form submit (does NOT reload page)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/events?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">
        Events {searchParam && `- Search results for "${searchParam}"`}
      </h2>

      <Form onSubmit={handleSearchSubmit} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit" variant="primary" disabled={!searchTerm.trim()}>
            Search
          </Button>
        </InputGroup>
      </Form>

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : events.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {events.map(ev => (
            <Col key={ev.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{ev.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(ev.date).toLocaleDateString()} &mdash; {ev.category || 'Uncategorized'}
                  </Card.Subtitle>
                  <Card.Text>{ev.description}</Card.Text>

                  <button
                    onClick={() => handleApply(ev)}
                    disabled={appliedEventIds.includes(ev.id)}
                    style={{
                      marginTop: '1rem',
                      backgroundColor: appliedEventIds.includes(ev.id) ? '#ccc' : '#007bff',
                      color: '#fff',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: appliedEventIds.includes(ev.id) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {appliedEventIds.includes(ev.id) ? 'Already Applied' : 'Apply'}
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <p className="text-center">No events found.</p>
      )}

      {/* Application Modal */}
      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', width: '400px' }}>
            <h2>Apply for {selectedEvent.title}</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              />
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="submit" style={{ padding: '0.5rem 1rem' }}>Submit</button>
                <button type="button" onClick={() => setSelectedEvent(null)} style={{ padding: '0.5rem 1rem' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Events;
