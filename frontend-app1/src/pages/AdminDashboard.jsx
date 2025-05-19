import React from 'react';
import AdminEvents from '../components/AdminEvents';
import { useAuth } from '../context/AuthContext';
import { Container, Alert } from 'react-bootstrap';

function AdminDashboard() {
  const { user } = useAuth();
  const userData = user?.user || user;

  if (!userData || !userData.isAdmin) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Access denied. You must be an admin to view this page.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <AdminEvents />
    </Container>
  );
}

export default AdminDashboard;
