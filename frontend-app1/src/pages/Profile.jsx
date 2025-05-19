import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Profile() {
  const { user } = useAuth();
  const userData = user?.user || user;
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    if (userData?.id) {
      axios
        .get(`https://localhost:7237/api/Applications/user/${userData.id}`)
        .then((res) => setUserEvents(res.data))
        .catch((err) => console.error('Failed to load user events:', err));
    }
  }, [userData?.id]);

  if (!userData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <div
        style={{
          background: '#f8f9fa',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}
      >
        <h2 style={{ marginBottom: '1rem', color: '#007bff' }}>My Profile</h2>
        <p><strong>Full Name:</strong> {userData.fullName}</p>
        <p><strong>Email:</strong> {userData.email}</p>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>My Event Applications</h3>
        {userEvents.length > 0 ? (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {userEvents.map((event) => (
              <div
                key={event.eventId}
                style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '10px',
                  padding: '1rem',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                }}
              >
                <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>
                  {event.title || 'Untitled Event'}
                </h4>
                <p style={{ margin: 0 }}>
                  📅 <strong>{event.date ? new Date(event.date).toLocaleDateString() : 'Unknown Date'}</strong>
                </p>
                <p style={{ margin: 0 }}>
                  🗂 <em>{event.category || 'Uncategorized'}</em>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#6c757d' }}>You haven't applied to any events yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
