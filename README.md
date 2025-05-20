# 🎉 SmartEvent - Application de Gestion d'Événements

SmartEvent est une application web complète permettant la gestion, la création et l'inscription à des événements. Le projet est divisé en deux parties :
- **Backend** en ASP.NET Core Web API
- **Frontend** en React.js

---

## 📁 Structure du Projet

### Backend (ASP.NET Core)
SmartEvent.API/
├── Controllers/
│ ├── ApplicationsController.cs
│ ├── EventController.cs
│ └── UsersController.cs
├── appsettings.json
SmartEvent.Data/
├── Entities/
│ ├── Event.cs
│ ├── EventApplication.cs
│ └── User.cs
├── DTOs/
│ └── CreateEventDto.cs
├── Migrations/
│ └── AppDbContext.cs
SmartEvent.Infrastructure/
├── Models/
│ ├── LoginModel.cs
│ └── RegistrationModel.cs

### Frontend (React.js)
frontend-app1/
├── src/
│ ├── components/
│ │ ├── AdminEvents.jsx
│ │ ├── EventApplicationForm.jsx
│ │ ├── LoginForm.jsx
│ │ ├── RegisterForm.jsx
│ │ ├── Navbar.jsx
│ │ └── Footer.jsx
│ ├── context/
│ │ └── AuthContext.jsx
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── Events.jsx
│ │ ├── Profile.jsx
│ │ ├── AdminDashboard.jsx
│ │ ├── About.jsx
│ │ ├── Contact.jsx
│ │ └── SecurityPolicy.jsx
│ └── styles/
│ ├── Footer.css
│ └── Navbar.css

---

## ⚙️ Fonctionnalités

### Utilisateurs
- Enregistrement et connexion
- Gestion du profil utilisateur
- Navigation sécurisée via contexte d’authentification

### Événements
- Affichage de la liste des événements (publics)
- Candidature / inscription à un événement
- Création, édition et suppression d’événements (Admin)

### Administrateur
- Accès à un dashboard
- Gestion complète des événements
- Suivi des candidatures aux événements

---

## 🚀 Lancement du Projet

Backend (.NET Core)
1. Ouvrir la solution `SmartEvent.sln` dans Visual Studio
2. Appliquer les migrations si nécessaire :
   ```bash
   dotnet ef database update
3. Lancer le projet API (SmartEvent.API)

Frontend (React)
1. Aller dans le dossier frontend-app1
2. Installer les dépendances :
  npm install
3. Démarrer l’application :
npm run dev

🧩 Technologies Utilisées
Backend
- ASP.NET Core Web API
- Entity Framework Core
- MySQL
Frontend
- React.js
- React-Bootstrap
- Context API (authentification)
