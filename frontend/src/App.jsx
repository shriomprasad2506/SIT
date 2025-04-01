import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import LoginForm from './pages/LoginForm';
import PrivateRoute from './components/PrivateRoute';

import Dashboard from './pages/admin/Dashboard';
import Events from './pages/admin/Events';
import Event from './pages/admin/Event';
import News from './pages/admin/News';
import NewsPage from './pages/admin/NewsPage';
import Announcements from './pages/admin/Announcements';
import Announcement from './pages/admin/Announcement';
import Faculties from './pages/admin/Faculties';

const App = () => {
  const isLoggedIn = !!sessionStorage.getItem('authToken'); // Check if the user is logged in
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* If the user is logged in, redirect to the dashboard, else show the login page */}
        <Route path="/login" element={isLoggedIn ? <Navigate to="/admin/dashboard" /> : <LoginForm />} />

        {/* Protected Routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/admin/events" element={<PrivateRoute element={<Events />} />} />
        <Route path="/admin/events/:eventId" element={<PrivateRoute element={<Event />} />} />

        <Route path="/admin/news" element={<PrivateRoute element={<News />} />} />
        <Route path="/admin/news/:newsId" element={<PrivateRoute element={<NewsPage />} />} />

        <Route path="/admin/announcements" element={<PrivateRoute element={<Announcements />} />} />
        <Route path="/admin/announcements/:announcementId" element={<PrivateRoute element={<Announcement />} />} />

        <Route path="/admin/faculty" element={<PrivateRoute element={<Faculties />} />} />

        {/* /not-found */}

        {/* Catch-all route for unknown paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
