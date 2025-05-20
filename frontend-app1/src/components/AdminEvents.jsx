import React, { useEffect, useState } from 'react';
import { Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';

/**
 * Composant AdminEvents permettant aux administrateurs de gérer les événements.
 * Fonctionnalités :
 * - Récupérer et afficher les événements existants
 * - Créer un nouvel événement
 * - Modifier un événement existant
 * - Supprimer un événement
 */
function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    category: 'music',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  /**
   * Récupère les événements via l'API et met à jour le state.
   */
  const fetchEvents = async () => {
    try {
      const res = await fetch('https://localhost:7237/api/events');
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Échec de la récupération des événements :', err);
    }
  };

  // Chargement des événements au montage du composant
  useEffect(() => {
    fetchEvents();
  }, []);

  /**
   * Gestion des changements dans le formulaire.
   * @param {Object} e - Événement de changement d'input
   */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Création d'un nouvel événement via l'API.
   */
  const handleCreate = async () => {
    try {
      const response = await fetch('https://localhost:7237/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        await fetchEvents();
        setForm({ title: '', description: '', date: '', category: 'music' });
      } else {
        console.error('Échec de la création de l\'événement');
      }
    } catch (err) {
      console.error('Erreur lors de la création de l\'événement :', err);
    }
  };

  /**
   * Mise à jour d'un événement existant via l'API.
   */
  const handleUpdate = async () => {
    try {
      const response = await fetch(`https://localhost:7237/api/events/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editingId }),
      });

      if (response.ok) {
        await fetchEvents();
        setForm({ title: '', description: '', date: '', category: 'music' });
        setIsEditing(false);
        setEditingId(null);
      } else {
        console.error('Échec de la mise à jour de l\'événement');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'événement :', err);
    }
  };

  /**
   * Prépare le formulaire pour éditer un événement existant.
   * @param {Object} event - Événement à modifier
   */
  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description,
      date: event.date.slice(0, 10), // Extraction de la date au format yyyy-mm-dd
      category: event.category,
    });
    setIsEditing(true);
    setEditingId(event.id);
  };

  /**
   * Suppression d'un événement via son ID.
   * @param {number|string} id - ID de l'événement à supprimer
   */
  const handleDelete = async (id) => {
    try {
      await fetch(`https://localhost:7237/api/events/${id}`, { method: 'DELETE' });
      await fetchEvents();
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'événement :', err);
    }
  };

  return (
    <>
      {/* Formulaire d'ajout / modification d'événement */}
      <Card className="mb-4 shadow">
        <Card.Body>
          <h4>{isEditing ? 'Modifier l\'événement' : 'Ajouter un nouvel événement'}</h4>
          <Form>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Titre"
                />
              </Col>
              <Col>
                <Form.Control
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Control
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                />
              </Col>
              <Col>
                <Form.Select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="music">Musique</option>
                  <option value="tech">Technologie</option>
                  <option value="art">Art</option>
                  <option value="sports">Sport</option>
                  <option value="business">Business</option>
                </Form.Select>
              </Col>
              <Col>
                {isEditing ? (
                  <Button variant="warning" onClick={handleUpdate}>
                    Modifier l'événement
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleCreate}>
                    Ajouter l'événement
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Liste des événements existants */}
      <Card className="mb-5 shadow">
        <Card.Body>
          <h4>Événements existants</h4>
          {events.length === 0 ? (
            <p>Aucun événement trouvé.</p>
          ) : (
            <ListGroup>
              {events.map((ev) => (
                <ListGroup.Item
                  key={ev.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{ev.title}</strong> — {new Date(ev.date).toLocaleDateString()} —{' '}
                    <em>{ev.category}</em>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" onClick={() => handleEdit(ev)}>
                      Modifier
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(ev.id)}>
                      Supprimer
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default AdminEvents;
