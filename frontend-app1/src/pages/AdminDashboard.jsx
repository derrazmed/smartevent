// Ce composant représente le tableau de bord administrateur de l'application EventManager.
// Il vérifie si l'utilisateur est un administrateur avant d'afficher les fonctionnalités réservées à l'administration.

import React from 'react';
import AdminEvents from '../components/AdminEvents'; // Composant pour gérer les événements (admin)
import { useAuth } from '../context/AuthContext'; // Hook contextuel pour récupérer l'utilisateur connecté
import { Container, Alert } from 'react-bootstrap'; // Composants de mise en page Bootstrap

function AdminDashboard() {
  const { user } = useAuth(); // Récupération de l'utilisateur depuis le contexte
  const userData = user?.user || user; // Gestion de l'éventuelle structure imbriquée

  // Si aucun utilisateur ou si l'utilisateur n'est pas admin, affichage d'une alerte d'accès refusé
  if (!userData || !userData.isAdmin) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Accès refusé. Vous devez être administrateur pour voir cette page.</Alert>
      </Container>
    );
  }

  // Si l'utilisateur est bien un admin, on affiche le tableau de bord avec la gestion des événements
  return (
    <Container className="mt-5">
      <h2 className="mb-4">Tableau de bord administrateur</h2>
      <AdminEvents />
    </Container>
  );
}

export default AdminDashboard;
