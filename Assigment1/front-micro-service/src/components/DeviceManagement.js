import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DeviceManagement.css';

const DeviceManagement = ({ showNotification }) => {
  const [devices, setDevices] = useState([]);
  const [newDevice, setNewDevice] = useState({
    description: '',
    address: '',
    consumption: 0,
    userId: '',
  });
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false);
  const [deviceToUpdate, setDeviceToUpdate] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/devices')
      .then(response => {
        setDevices(response.data);
        console.log('Devices:', response.data);
      })
      .catch(error => showNotification('Error fetching devices', 'error'));
  }, []);

  const handleCreateDevice = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8081/devices/create', newDevice);
      const response = await axios.get('http://localhost:8081/devices');
      setDevices(response.data);
      showNotification('Device created successfully', 'success');
    } catch (error) {
      showNotification('Error creating device', 'error');
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      await axios.delete(`http://localhost:8081/devices/delete/${deviceId}`);
      setDevices(devices.filter(device => device.deviceId !== deviceId));
      showNotification('Device deleted successfully', 'success');
    } catch (error) {
      showNotification('Error deleting device', 'error');
    }
  };

  const handleOpenUpdatePopup = (device) => {
    setDeviceToUpdate({ ...device });
    setIsUpdatePopupOpen(true);
  };

  const handleUpdateDevice = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:8081/devices/update', deviceToUpdate);
      const response = await axios.get('http://localhost:8081/devices');
      setDevices(response.data);
      showNotification('Device updated successfully', 'success');
      setIsUpdatePopupOpen(false);
    } catch (error) {
      showNotification('Error updating device', 'error');
    }
  };

  const handleUpdateInputChange = (e) => {
    setDeviceToUpdate({ ...deviceToUpdate, [e.target.name]: e.target.value });
  };

  const handleInputChange = (e) => {
    setNewDevice({ ...newDevice, [e.target.name]: e.target.value });
  };

  return (
    <div className="device-management">
      <h2>Manage Devices</h2>
      <form onSubmit={handleCreateDevice} className="device-form">
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newDevice.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newDevice.address}
          onChange={handleInputChange}
          required
        />
        <input
  type="text"
  name="consumption"
  placeholder="Consumption"
  value={newDevice.consumption}
  onChange={(e) => {
    // Allow only digits and one optional decimal point (if needed for float values)
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      handleInputChange(e); // Proceed only if the value matches the regex
    }
  }}
  required
/>
        <input
          type="text"
          name="userId"
          placeholder="User ID"
          value={newDevice.userId}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Create Device</button>
      </form>

      <h2>Device List</h2>
      <table className="device-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Address</th>
            <th>Consumption</th>
            <th>User Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.map(device => (
            <tr key={device.deviceId}>
              <td>{device.deviceId}</td>
              <td>{device.description}</td>
              <td>{device.address}</td>
              <td>{device.consumption}</td>
              <td><ul>
                <li>ID: {device.user.userId}</li>
                <li>Username: {device.user.username}</li>
                <li>Email: {device.user.email}</li>
                <li>Telephone: {device.user.telephone}</li>
                </ul></td>
              <td>
                <button onClick={() => handleOpenUpdatePopup(device)} className="update-button">Update</button>
                <button onClick={() => handleDeleteDevice(device.deviceId)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isUpdatePopupOpen && deviceToUpdate && (
        <div className="update-popup">
          <form onSubmit={handleUpdateDevice} className="update-form">
            <h3>Update Device</h3>
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={deviceToUpdate.description}
              onChange={handleUpdateInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={deviceToUpdate.address}
              onChange={handleUpdateInputChange}
              required
            />
            <input
              type="number"
              name="consumption"
              placeholder="Consumption"
              value={deviceToUpdate.consumption}
              onChange={handleUpdateInputChange}
              required
            />
            <input
              type="number"
              name="userId"
              placeholder="User ID"
              value={deviceToUpdate.userId}
              onChange={handleUpdateInputChange}
              required
            />
            <button type="submit">Update Device</button>
            <button type="button" onClick={() => setIsUpdatePopupOpen(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
