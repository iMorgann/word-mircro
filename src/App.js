import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Lauth from './page/Lauth'; // Login/Auth Page
import AccountActivated from './components/AccountActivated';

function App() {
  return (
    <Router>
      <Routes>
        {/* Define your routes here */}
        <Route path="/" element={<Lauth />} /> {/* Default login/auth page */}
        <Route path="/signin" element={<Lauth />} /> {/* Sign-in modal */}
        <Route path="/home" element={<Lauth />} /> {/* Main app/homepage */}
        <Route path="/activated" element={<AccountActivated />} /> {/* Activation page */}
      </Routes>
    </Router>
  );
}

export default App;
