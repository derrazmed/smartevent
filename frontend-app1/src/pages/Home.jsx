import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function Home() {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    paymentMethod: 'credit_card',
  });

  const { user } = useAuth();
  const userData = user?.user || user;
  const [appliedEventIds, setAppliedEventIds] = useState([]);

  /* ───── Fetch upcoming events (3 closest) ───── */
  useEffect(() => {
    fetch('https://localhost:7237/api/events')
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        setEvents(sorted);
      })
      .catch((err) => console.error('Failed to fetch events:', err));
  }, []);

  /* ───── Fetch applications for logged‑in user ───── */
  useEffect(() => {
    if (!userData) {
      setAppliedEventIds([]);
      return;
    }

    fetch(`https://localhost:7237/api/applications/user/${userData.id}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) return [];
          throw new Error(await res.text());
        }
        return res.json();
      })
      .then((apps) => {
        const ids = [...new Set(apps.map((a) => a.eventId))];
        setAppliedEventIds(ids);
      })
      .catch((err) =>
        console.error('Failed to fetch applications:', err.message),
      );
  }, [userData]);

  /* ───── Auto‑advance every 5 s (only when list is ready) ───── */
  useEffect(() => {
    if (events.length === 0) return;

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(id);
  }, [events.length]);

  /* ───── Handlers ───── */
  const handleApply = (ev) => {
    if (!userData) {
      alert('Please log in to apply for an event.');
      return;
    }
    setSelectedEvent(ev);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
      const res = await fetch('https://localhost:7237/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(application),
      });

      if (!res.ok) {
        const { message } = await res.json();
        alert(message || 'Failed to submit application');
        return;
      }

      setAppliedEventIds((prev) => [...prev, selectedEvent.id]);
      setSelectedEvent(null);
      setFormData({ phone: '', address: '', paymentMethod: 'credit_card' });
    } catch (err) {
      console.error(err.message);
    }
  };

  /* ───── Carousel helpers ───── */
  const prevEvent = () =>
    setCurrentIndex((i) => (i - 1 + events.length) % events.length);
  const nextEvent = () =>
    setCurrentIndex((i) => (i + 1) % events.length);

  const currentEvent = events[currentIndex];

  /* ───── JSX ───── */
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        Upcoming Events
      </h1>

      <div style={{ position: 'relative' }}>
        <AnimatePresence mode="wait">
          {currentEvent && (
            <motion.div
              key={currentEvent.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '80%',
                margin: '0 auto',
                padding: '2rem',
                border: '2px solid #007bff',
                borderRadius: '16px',
                background: '#f9f9f9',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{currentEvent.title}</h2>
              <p style={{ fontSize: '1rem', color: '#555' }}>
                {currentEvent.description.length > 100
                  ? currentEvent.description.slice(0, 100) + '...'
                  : currentEvent.description}
              </p>
              <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
                📅 {new Date(currentEvent.date).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleApply(currentEvent)}
                disabled={appliedEventIds.includes(currentEvent.id)}
                style={{
                  marginTop: '1rem',
                  backgroundColor: appliedEventIds.includes(currentEvent.id) ? '#ccc' : '#007bff',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: appliedEventIds.includes(currentEvent.id) ? 'not-allowed' : 'pointer'
                }}
              >
                {appliedEventIds.includes(currentEvent.id) ? 'Already Applied' : 'Apply'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Arrows: no animation */}
        <button
          onClick={prevEvent}
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            transform: 'translateY(-50%)',
            fontSize: '2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ◀
        </button>
        <button
          onClick={nextEvent}
          style={{
            position: 'absolute',
            top: '50%',
            right: '0',
            transform: 'translateY(-50%)',
            fontSize: '2rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          ▶
        </button>
        {/* ───── Dots / indicators ───── */}
        <div style={{ marginTop: '1rem' }}>
          {events.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              style={{
                display: 'inline-block',
                margin: '0 6px',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: currentIndex === idx ? '#007bff' : '#ccc',
                transition: 'color 0.3s',
              }}
            >
              {currentIndex === idx ? '●' : '○'}
            </span>
          ))}
        </div>
    </div>

            

      {/* ───── Application modal ───── */}
      {selectedEvent && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '8px',
              width: '400px',
            }}
          >
            <h2>Apply for {selectedEvent.title}</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '1rem',
                }}
              />
              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '1rem',
                }}
              />
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginBottom: '1rem',
                }}
              >
                <option value="credit_card">Credit Card</option>
                <option value="paypal">PayPal</option>
              </select>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <button type="submit" style={{ padding: '0.5rem 1rem' }}>
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
