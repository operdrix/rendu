import "react-quill-new/dist/quill.snow.css";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import './App.css';
import Navbar from './components/Navbar';
import { UserProvider } from './context/UserContext';
import AdminPage from './pages/Admin';
import ArticlePage from './pages/Article';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import NotFoundPage from './pages/NotFound';
import RegisterPage from './pages/Register';


function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <ToastContainer position='bottom-right' />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
