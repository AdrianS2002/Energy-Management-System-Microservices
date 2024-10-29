import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css'; // Optional CSS file for styling

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    telephone: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/users', formData);
      // Redirect or notify user after successful sign-up
      console.log('User registered successfully', response.data);
      window.location.href = '/log-in'; // Redirect to the login page
    } catch (error) {
      console.error('Sign-up error:', error);
      setError(error.response?.data?.message || 'An error occurred while signing up');
    }
  };

  return (
    <div className="signup-main-container">
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h6>Username:</h6>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <h6>Email:</h6>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <h6>Password:</h6>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <h6>Telephone:</h6>
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
    </div>
  );
};

export default SignUp;
