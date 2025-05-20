import React, { useState } from 'react';
import { Form, Button, Container, Alert, Card, InputGroup } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // icônes pour afficher/cacher le mot de passe
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Composant formulaire de connexion utilisateur.
 * 
 * Gère :
 * - Les champs email et mot de passe.
 * - La visibilité du mot de passe (afficher/cacher).
 * - La soumission du formulaire avec appel API POST vers /api/users/login.
 * - L'affichage d'un message de succès ou d'erreur.
 * - La redirection vers la page d'accueil après connexion réussie.
 * - La mise à jour du contexte utilisateur et stockage en localStorage.
 */
function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const [showPassword, setShowPassword] = useState(false); // état pour afficher/cacher mot de passe
  const navigate = useNavigate();
  const { setUser } = useAuth();

  // Mise à jour des valeurs des champs de formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Soumission du formulaire de connexion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setVariant('');

    try {
      const response = await fetch('https://localhost:7237/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Connexion réussie !');
        setVariant('success');
        navigate('/');
      } else {
        const errData = await response.json();
        setMessage(errData.message || 'Échec de la connexion');
        setVariant('danger');
      }
    } catch (error) {
      setMessage('Erreur de connexion au serveur');
      setVariant('danger');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow">
        <h3 className="text-center mb-3">Connexion</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Adresse email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Entrez votre email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Mot de passe</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <small>
              <a href="/register">Vous n'avez pas de compte ? Inscrivez-vous</a>
            </small>
          </div>

          <Button variant="primary" type="submit" className="w-100">
            Se connecter
          </Button>
        </Form>

        {message && (
          <Alert variant={variant} className="mt-3">
            {message}
          </Alert>
        )}
      </Card>
    </Container>
  );
}

export default LoginForm;
