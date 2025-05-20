import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

/**
 * Composant formulaire d'inscription utilisateur.
 * Permet de saisir nom complet, email et mot de passe,
 * puis d'envoyer les données à l'API pour créer un compte.
 */
const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  /**
   * Met à jour les données du formulaire à chaque modification des champs.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Événement de changement d'un champ
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Envoie les données du formulaire à l'API pour enregistrer un nouvel utilisateur.
   * Affiche un message de succès ou d'erreur et redirige vers la page de connexion en cas de succès.
   * @param {React.FormEvent<HTMLFormElement>} e - Événement de soumission du formulaire
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setVariant('');

    try {
      const response = await axios.post('https://localhost:7237/api/users/register', formData);
      setMessage(response.data.message || "Inscription réussie !");
      setVariant('success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Échec de l'inscription.";
      setMessage(errMsg);
      setVariant('danger');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: '100%', maxWidth: '400px' }} className="p-4 shadow">
        <h3 className="text-center mb-3">Inscription</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formFullName">
            <Form.Label>Nom complet</Form.Label>
            <Form.Control
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Entrez votre nom complet"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Adresse e-mail</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrez votre e-mail"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Mot de passe</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mot de passe"
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(prev => !prev)}
                tabIndex={-1}
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <small>
              <a href="/login">Vous avez déjà un compte ? Connexion</a>
            </small>
          </div>

          <Button variant="primary" type="submit" className="w-100">
            S'inscrire
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
};

export default RegisterForm;
