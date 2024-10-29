import React from 'react';
import { createRoot } from 'react-dom/client'; 
import './index.css';
import App from './App.js';


const container = document.getElementById('root');
const root = createRoot(container); // Create a root using the new API

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);