import React, { useState } from 'react';

function EventApplicationForm({ event, onClose }) {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    paymentMethod: 'credit_card'
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // POST to API here
    try {
      const response = await fetch('https://localhost:7183/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, eventId: event.id })
      });
      if (response.ok) {
        alert('Application submitted!');
        onClose();
      } else {
        alert('Error submitting application');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Apply for {event.title}</h2>
      <form onSubmit={handleSubmit}>
        <input name="phone" placeholder="Phone number" onChange={handleChange} required />
        <input name="address" placeholder="Address" onChange={handleChange} required />
        <select name="paymentMethod" onChange={handleChange}>
          <option value="credit_card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default EventApplicationForm;
