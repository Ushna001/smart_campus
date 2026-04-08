import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import Bookings from './pages/Bookings';
import Resources from './pages/Resources';
import Tickets from './pages/Tickets';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
      
      {/* Protected Routes inside Layout */}
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Dashboard />} />
        <Route path="resources" element={<Resources />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="tickets" element={<Tickets />} />
      </Route>
    </Routes>
  );
}

export default App;
