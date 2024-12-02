import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdminPage from './pages/Admin';
import ArticlePage from './pages/Article';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import NotFoundPage from './pages/NotFound';
import RegisterPage from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
