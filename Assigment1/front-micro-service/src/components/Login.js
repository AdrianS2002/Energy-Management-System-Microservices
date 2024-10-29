import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie
import './Login.css'; // Optional CSS file for styling
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize navigate

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        password
      });

      // Log the response to the console for debugging
      console.log('Response data:', response.data);

      // Save user information in cookies instead of localStorage
      Cookies.set('username', response.data.username, { expires: 7 }); // Expires in 7 days
      Cookies.set('id', response.data.id, { expires: 7 });
      Cookies.set('role', response.data.role, { expires: 7 });

      // Redirect based on the user's role
      if (response.data.role === 'USER') {
        navigate(`/user/${response.data.id}`); // Redirect to the user's page
      } else if (response.data.role === 'ADMIN') {
        navigate('/admin/dashboard'); // Redirect to the admin dashboard page
      } else {
        navigate('/'); // Redirect to a default page
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'Authentication failed');
      } else {
        setError('An error occurred while connecting to the server');
      }
    }
  };

  return (
    <div className="mainLoginConteiner">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <h6>Username:</h6>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <h6>Password:</h6>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button>
            <span className="hover-bg"></span>
            <div className="button-text">Login</div>
          </button>
        </form>
        <div className="signup-link">
          <Link to="/sign-up">Don't have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
