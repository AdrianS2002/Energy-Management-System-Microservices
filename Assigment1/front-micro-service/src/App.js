import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from './components/Login.js';
import UserDevices from './components/UserDevices.js';
import SignUp from './components/SignUp.js'; // Import the new component
import AdminDashboard from './components/AdminDashboard.js';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/log-in" element={<Login />} />
        <Route path="/user/:userId" element={<UserDevices />} />
        <Route path="/sign-up" element={<SignUp />} /> {/* Add the new route */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
