import React, { useEffect, useState } from 'react';

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '' });

  const fetchEvents = async () => {
    try {
      const res = await fetch('https://localhost:7183/api/events');
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
    const eventPayload = {
      title: form.title,
      description: form.description,
      date: form.date
    };

    try {
      const response = await fetch('https://localhost:7183/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload)
      });

      if (response.ok) {
        fetchEvents();
        setForm({ title: '', description: '', date: '' });
      } else {
        console.error('Failed to create event');
      }
    } catch (err) {
      console.error('Error creating event:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`https://localhost:7183/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  return (
    <div>
      <h2>Manage Events</h2>
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
      />
      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
      />
      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
      />
      <button onClick={handleCreate}>Add Event</button>

      <ul>
        {events.map(ev => (
          <li key={ev.id}>
            <strong>{ev.title}</strong> - {new Date(ev.date).toLocaleDateString()}
            <button onClick={() => handleDelete(ev.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminEvents;
