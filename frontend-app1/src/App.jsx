import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RegisterForm from './components/RegisterForm';
import Home from './pages/Home';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Events from './pages/Events';
import { AuthProvider } from './context/AuthContext';
import About from './pages/About';
import Contact from './pages/Contact';
import SecurityPolicy from './pages/SecurityPolicy';
import './App.css';

function App() {
  return (
    
      <AuthProvider>
        <Router>
          <Navbar/>
          <div className="app-wrapper">
          <Routes>
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/security-policy" element={<SecurityPolicy />} />
          </Routes>
          <Footer />
          </div>
        </Router>
      </AuthProvider>
    
    
  );
}
export default App;