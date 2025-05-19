import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    paymentMethod: 'credit_card'
  });

  const { user } = useAuth();
  const userData = user?.user || user;
  const [appliedEventIds, setAppliedEventIds] = useState([]);

  useEffect(() => {
    fetch('https://localhost:7183/api/events')
      .then(res => res.json())
      .then(data => {
        const sortedEvents = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);
      })
      .catch(err => console.error('Failed to fetch events:', err));
  }, []);

  useEffect(() => {
    if (userData) {
      fetch(`https://localhost:7183/api/applications/user/${userData.id}`)
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
    if (!userData) return;

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
      const response = await fetch('https://localhost:7183/api/applications', {
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

  return (
    <div>
      <h1>Upcoming Events</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {events.map(event => (
          <div key={event.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', width: '300px' }}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <small>{new Date(event.date).toLocaleDateString()}</small><br />
            <button
              onClick={() => handleApply(event)}
              disabled={appliedEventIds.includes(event.id)}
              style={{
                backgroundColor: appliedEventIds.includes(event.id) ? '#ccc' : '#007bff',
                color: '#fff',
                cursor: appliedEventIds.includes(event.id) ? 'not-allowed' : 'pointer',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px'
              }}
              title={appliedEventIds.includes(event.id) ? 'Already applied to this event' : ''}
            >
              {appliedEventIds.includes(event.id) ? 'Already Applied' : 'Apply'}
            </button>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px' }}>
            <h2>Apply for {selectedEvent.title}</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              /><br /><br />
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              /><br /><br />
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select><br /><br />
              <button type="submit">Submit Application</button>
              <button type="button" onClick={() => setSelectedEvent(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
