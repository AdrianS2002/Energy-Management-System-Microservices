import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './UserDevices.css'; // Optional CSS file for styling
import { useParams, useNavigate } from 'react-router-dom';

const UserDevices = () => {
  const { userId } = useParams();
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();
  
  // Get the current user's ID from cookies
  const loggedInUserId = Cookies.get('id'); // Retrieve ID from cookies

  useEffect(() => {
    // Log retrieved values for debugging purposes
    console.log('Logged-in User ID from cookies:', loggedInUserId);
    console.log('Requested User ID from URL:', userId);

    // If the user is not logged in or the logged-in user's ID does not match the requested userId, perform a logout
    if (!loggedInUserId || loggedInUserId !== userId) {
      console.warn("Unauthorized access or user not logged in. Logging out and redirecting to login.");

      // Clear all user-related cookies to log out the user
      Cookies.remove('id');
      Cookies.remove('username');
      Cookies.remove('role');

      // Redirect to the login page
      navigate('/log-in');
      return;
    }

    // Fetch user's devices from the backend
    const fetchDevices = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/devices/user/${userId}`);
        console.log('Devices:', response.data);
        setDevices(response.data); // Set the entire devices list
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, [userId, loggedInUserId, navigate]);

  const handleLogout = () => {
    // Clear cookies or any other stored authentication information
    Cookies.remove('id');
    Cookies.remove('username');
    Cookies.remove('role');

    // Redirect to the login page
    navigate('/log-in');
  };

  return (
    <div className="user-devices">
      <div className="title">
        <h2>Your Devices</h2>
        <img src="/logout.png" className="logout" onClick={handleLogout} alt="Logout" />
      </div>
      <table className="devices-table">
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Description</th>
            <th>Address</th>
            <th>Consumption</th>
            <th>User ID</th>
          </tr>
        </thead>
        <tbody>
          {devices.length === 0 ? (
            <tr>
              <td colSpan="5">No devices assigned</td> {/* Spanning all columns with a message */}
            </tr>
          ) : (
            devices.map((device) => (
              <tr key={device.deviceId}>
                <td>{device.deviceId}</td>
                <td>{device.description}</td>
                <td>{device.address}</td>
                <td>{device.consumption}</td>
                <td>{device.userId}</td>
                
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserDevices;
