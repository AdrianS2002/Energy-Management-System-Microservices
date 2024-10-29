import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // Import the CSS for styling
import DeviceManagement from './DeviceManagement';
import Cookies from 'js-cookie';
import { useParams, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
const { userId } = useParams();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    telephone: '',
    role: 'USER',
  });

  

  const [notification, setNotification] = useState({ message: '', type: '', visible: false });
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const navigate = useNavigate();

  const [isDevicesPopupOpen, setIsDevicesPopupOpen] = useState(false);
  const [userDevices, setUserDevices] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const openDevicesPopup = async (userId, role) => {
    if (role !== 'USER') {
      showNotification('Devices can only be viewed for users with the "USER" role.', 'error');
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:8081/devices/user/${userId}`);
      setUserDevices(response.data);
      setSelectedUserId(userId);
      setIsDevicesPopupOpen(true);
    } catch (error) {
      console.error('Error fetching devices for user:', error);
      showNotification('Error fetching devices', 'error');
    }
  };

  const loggedInUserId = Cookies.get('id');
  const loggedInUserRole = Cookies.get('role');

  useEffect(() => {

    console.log('Logged-in User ID:', loggedInUserId);
    console.log('Logged-in User Role:', loggedInUserRole);

    if (!loggedInUserId || loggedInUserRole !== 'ADMIN') {
        console.warn("Unauthorized access or user not logged in. Logging out and redirecting to login.");
        Cookies.remove('id');
        Cookies.remove('username');
        Cookies.remove('role');
        navigate('/log-in');
        return;
      }
    // Fetch all users on component mount
    axios.get('http://localhost:8080/users')
      .then(response => setUsers(response.data))
      .catch(error => showNotification('Error fetching users', 'error'));
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => {
      setNotification({ message: '', type: '', visible: false });
    }, 3000); // Hide notification after 3 seconds
  };

  const handleLogout = () => {
    // Clear cookies or any other stored authentication information
    Cookies.remove('id');
    Cookies.remove('username');
    Cookies.remove('role');

    // Redirect to the login page
    navigate('/log-in');
  };

  // Handle user creation
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/users', newUser);
      // Refresh user list after successful creation
      const response = await axios.get('http://localhost:8080/users');
      setUsers(response.data);
      showNotification('User created successfully', 'success');
    } catch (error) {
      showNotification('Error creating user', 'error');
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/users/${userId}`);
      // Update the state by filtering out the deleted user
      setUsers(users.filter(user => user.userId !== userId));
      showNotification('User deleted successfully', 'success');
    } catch (error) {
      showNotification('Error deleting user', 'error');
    }
  };

  // Handle input changes for creating a new user
  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  // Handle updating a user
  // Handle updating a user
const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    try {
        // Create update payload without password if it's blank (to avoid sending unchanged password)
        const updatePayload = {
          userDTO: {
            userId: userToUpdate.userId,
            username: userToUpdate.username,
            email: userToUpdate.email,
            password: userToUpdate.password || undefined, // Send password only if it's been updated
            telephone: userToUpdate.telephone,
            role: userToUpdate.role,
          },
          role: userToUpdate.role,
          email: userToUpdate.email,
          password: userToUpdate.password ? userToUpdate.password : undefined,
          telephone: userToUpdate.telephone,
          username: userToUpdate.username,
        };
  
      // Make the PUT request with the constructed payload
      await axios.put(`http://localhost:8080/users`, updatePayload);
      
      // Refresh the user list after a successful update
      const response = await axios.get('http://localhost:8080/users');
      setUsers(response.data);
      showNotification('User updated successfully', 'success');
      setIsUpdatePopupOpen(false); // Close the update popup
    } catch (error) {
      showNotification('Error updating user', 'error');
    }
  };
  

  // Handle opening the update popup
  const openUpdatePopup = (user) => {
    // Copy all user properties except for the password
    setUserToUpdate({ 
      ...user, 
      password: '' // Set password as empty by default
    });
    setIsUpdatePopupOpen(true);
  };
  // Handle input changes for updating a user
  const handleUpdateInputChange = (e) => {
    setUserToUpdate({ ...userToUpdate, [e.target.name]: e.target.value });
  };

  return (
    
    <div className="admin-dashboard-page">
  <div className='admTitle'>
  <img src="/logout.png" className="logout" onClick={handleLogout} alt="Logout" />
    <h1 className="titleDash">Admin Dashboard</h1>
    
  </div>
  <div className="admin-dashboard-container">
    <div className="user-frame">
      <div className="admin-dashboard">
        <h2>Manage Users</h2>
        <form onSubmit={handleCreateUser} className="user-form"> <input
      type="text"
      name="username"
      placeholder="Username"
      value={newUser.username}
      onChange={handleInputChange}
      required
    />
    <input
      type="email"
      name="email"
      placeholder="Email"
      value={newUser.email}
      onChange={handleInputChange}
      required
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      value={newUser.password}
      onChange={handleInputChange}
      required
    />
    <input
      type="text"
      name="telephone"
      placeholder="Telephone"
      value={newUser.telephone}
      onChange={handleInputChange}
      required
    />
    <button type="submit">Create User</button>
  </form>

  <h2>User List</h2>
  <table className="user-table">
    <thead>
      <tr>
        <th>Username</th>
        <th>Email</th>
        <th>Telephone</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user.userId}>
          <td onClick={() => openDevicesPopup(user.userId, user.role)}
            style={{ cursor: 'pointer', color: user.role === 'USER' ? 'blue' : 'black' }}>
              {user.username}
          </td>
          <td>{user.email}</td>
          <td>{user.telephone}</td>
            <td>{user.role}</td>
          <td>
            <button onClick={() => openUpdatePopup(user)} className="update-button">Update</button>
            <button onClick={() => handleDeleteUser(user.userId)} className="delete-button">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Notification Popup */}
  {notification.visible && (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  )}

{isDevicesPopupOpen && (
  <div className="devices-popup">
    <div className="popup-content">
      <h3>Devices for User: {selectedUserId}</h3>
      
      <table className="devices-table">
        <thead>
          <tr>
            <th>Device ID</th>
            <th>Description</th>
            <th>Address</th>
            <th>Consumption</th>
          </tr>
        </thead>
        <tbody>
          {userDevices.length === 0 ? (
            <tr>
              <td colSpan="4">No devices assigned</td>
            </tr>
          ) : (
            userDevices.map((device) => (
              <tr key={device.deviceId}>
                <td>{device.deviceId}</td>
                <td>{device.description}</td>
                <td>{device.address}</td>
                <td>{device.consumption}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button className="close-button" onClick={() => setIsDevicesPopupOpen(false)}>Close</button>
    </div>
  </div>
)}

  {/* Update User Popup */}
  {isUpdatePopupOpen && userToUpdate && (
    <div className="update-popup">
      <form onSubmit={handleUpdateUser} className="update-form">
        <h3>Update User</h3>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={userToUpdate.username}
          onChange={handleUpdateInputChange}
          required
          autoComplete="off"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userToUpdate.email}
          onChange={handleUpdateInputChange}
          required
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={userToUpdate.password}
          onChange={handleUpdateInputChange}
          autoComplete="new-password"
        />
        <input
          type="text"
          name="telephone"
          placeholder="Telephone"
          value={userToUpdate.telephone}
          onChange={handleUpdateInputChange}
          required
        />
        <select
          name="role"
          value={userToUpdate.role}
          onChange={handleUpdateInputChange}
          required
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">Update User</button>
        <button type="button" onClick={() => setIsUpdatePopupOpen(false)}>Cancel</button>
      </form>
    </div>
  
    )}
    </div>
    </div>
      <div className="device-frame">
        <DeviceManagement showNotification={showNotification} />
      </div>
    </div>
    </div>
  );
};
export default AdminDashboard;
