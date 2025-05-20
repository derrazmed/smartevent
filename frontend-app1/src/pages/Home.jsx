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

  // ───── Récupération des 3 prochains événements ─────
  useEffect(() => {
    fetch('https://localhost:7237/api/events')
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3);
        setEvents(sorted);
      })
      .catch((err) => console.error('Échec du chargement des événements :', err));
  }, []);

  // ───── Vérification des candidatures de l’utilisateur ─────
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
        console.error('Échec du chargement des candidatures :', err.message),
      );
  }, [userData]);

  // ───── Défilement automatique toutes les 5 secondes ─────
  useEffect(() => {
    if (events.length === 0) return;

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(id);
  }, [events.length]);

  // ───── Gestionnaires ─────
  const handleApply = (ev) => {
    if (!userData) {
      alert('Veuillez vous connecter pour postuler à un événement.');
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
        alert(message || 'Échec de la soumission');
        return;
      }

      setAppliedEventIds((prev) => [...prev, selectedEvent.id]);
      setSelectedEvent(null);
      setFormData({ phone: '', address: '', paymentMethod: 'credit_card' });
    } catch (err) {
      console.error(err.message);
    }
  };

  // ───── Fonctions utilitaires du carrousel ─────
  const prevEvent = () =>
    setCurrentIndex((i) => (i - 1 + events.length) % events.length);
  const nextEvent = () =>
    setCurrentIndex((i) => (i + 1) % events.length);

  const currentEvent = events[currentIndex];

  // ───── Rendu JSX ─────
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        Événements à venir
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
                {appliedEventIds.includes(currentEvent.id) ? 'Déjà inscrit' : 'Postuler'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Flèches de navigation */}
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

        {/* Indicateurs (points) */}
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

      {/* Fenêtre modale de candidature */}
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
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '2rem 2.5rem',
              borderRadius: '12px',
              width: '420px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
            }}
          >
            <h2
              style={{
                marginBottom: '1.5rem',
                fontWeight: '700',
                fontSize: '1.8rem',
                color: '#007bff',
                textAlign: 'center',
              }}
            >
              Postuler à {selectedEvent.title}
            </h2>
            <form onSubmit={handleSubmit} noValidate>
              {/* Champ téléphone */}
              {/* Champ adresse */}
              {/* Méthode de paiement */}
              {/* Boutons Submit / Cancel */}
              {/* ... Tous les champs sont identiques au code anglais, seul le texte change ... */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
