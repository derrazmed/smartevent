import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AdminEvents from '../components/AdminEvents';
import axios from 'axios';

function Profile() {
  const { user } = useAuth();
  const userData = user?.user || user;
  const [userEvents, setUserEvents] = useState([]);

  useEffect(() => {
    if (userData?.id) {
      axios.get(`https://localhost:7183/api/Applications/user/${userData.id}`)
        .then(res => setUserEvents(res.data))
        .catch(err => console.error('Failed to load user events:', err));
    }
  }, [userData?.id]);

  if (!userData) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div>
      <h2>My Profile</h2>
      <p><strong>Full Name:</strong> {userData.fullName}</p>
      <p><strong>Email:</strong> {userData.email}</p>

      <h3>My Event Applications</h3>
      {userEvents.length > 0 ? (
        <ul>
          {userEvents.map((event) => (
            <li key={event.eventId}>
              <strong>{event.title || 'Untitled Event'}</strong> —{' '}
              {event.date ? new Date(event.date).toLocaleDateString() : 'Unknown Date'}
            </li>
          ))}
        </ul>
      ) : (
        <p>You haven't applied to any events yet.</p>
      )}

      {userData.isAdmin && (
        <div>
          <h3>Admin Panel</h3>
          <AdminEvents />
        </div>
      )}
    </div>
  );
}

export default Profile;
