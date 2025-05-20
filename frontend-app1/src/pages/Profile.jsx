import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

function Profile() {
  const { user } = useAuth();
  const userData = user?.user || user;
  const [userEvents, setUserEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventToCancel, setEventToCancel] = useState(null);

  // Charger les candidatures de l'utilisateur
  useEffect(() => {
    if (userData?.id) {
      axios
        .get(`https://localhost:7237/api/Applications/user/${userData.id}`)
        .then((res) => setUserEvents(res.data))
        .catch((err) =>
          console.error("Échec du chargement des événements de l'utilisateur :", err)
        );
    }
  }, [userData?.id]);

  const handleCancelClick = (eventId) => {
    setEventToCancel(eventId);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    try {
      const response = await fetch(
        `https://localhost:7237/api/Applications/cancel?userId=${userData.id}&eventId=${eventToCancel}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setUserEvents((prev) => prev.filter((e) => e.eventId !== eventToCancel));
      } else {
        console.error('Échec de l’annulation de la candidature');
      }
    } catch (err) {
      console.error('Erreur lors de l’annulation de la candidature :', err);
    } finally {
      setShowModal(false);
      setEventToCancel(null);
    }
  };

  if (!userData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Veuillez vous connecter pour voir votre profil.</p>
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
          marginBottom: '2rem',
        }}
      >
        <h2 style={{ marginBottom: '1rem', color: '#007bff' }}>Mon Profil</h2>
        <p><strong>Nom complet :</strong> {userData.fullName}</p>
        <p><strong>Email :</strong> {userData.email}</p>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>Mes candidatures aux événements</h3>
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
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                }}
              >
                <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>
                  {event.title || 'Événement sans titre'}
                </h4>
                <p style={{ margin: 0 }}>
                  📅 <strong>{event.date ? new Date(event.date).toLocaleDateString() : 'Date inconnue'}</strong>
                </p>
                <p style={{ margin: 0 }}>
                  🗂 <em>{event.category || 'Non catégorisé'}</em>
                </p>
                <button
                  onClick={() => handleCancelClick(event.eventId)}
                  style={{
                    marginTop: '0.75rem',
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Annuler la candidature
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#6c757d' }}>
            Vous n'avez encore postulé à aucun événement.
          </p>
        )}
      </div>

      {/* Modale de confirmation d’annulation */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation d'annulation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr(e) de vouloir annuler votre candidature à cet événement ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Non, conserver
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            Oui, annuler
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Profile;
