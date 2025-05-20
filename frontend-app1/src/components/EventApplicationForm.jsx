import React, { useState } from 'react';

/**
 * Composant formulaire d'inscription à un événement.
 * 
 * Props:
 * - event: objet événement sélectionné (doit contenir au moins un id et un title)
 * - onClose: fonction callback appelée après la soumission réussie pour fermer le formulaire
 * 
 * Permet à l'utilisateur de saisir son téléphone, adresse et mode de paiement,
 * puis envoie ces données à l'API pour créer une candidature.
 */
function EventApplicationForm({ event, onClose }) {
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    paymentMethod: 'credit_card',
  });

  /**
   * Met à jour l'état du formulaire à chaque changement d'input.
   * @param {Object} e - événement de changement d'input
   */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Envoie les données du formulaire à l'API lors de la soumission.
   * @param {Object} e - événement de soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://localhost:7237/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, eventId: event.id }),
      });

      if (response.ok) {
        alert('Votre candidature a bien été envoyée !');
        onClose();
      } else {
        alert('Erreur lors de l\'envoi de la candidature.');
      }
    } catch (error) {
      console.error('Erreur :', error);
    }
  };

  return (
    <div>
      <h2>Postuler pour {event.title}</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="phone"
          placeholder="Numéro de téléphone"
          onChange={handleChange}
          required
        />
        <input
          name="address"
          placeholder="Adresse"
          onChange={handleChange}
          required
        />
        <select name="paymentMethod" onChange={handleChange} value={formData.paymentMethod}>
          <option value="credit_card">Carte bancaire</option>
          <option value="paypal">PayPal</option>
        </select>
        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
}

export default EventApplicationForm;
