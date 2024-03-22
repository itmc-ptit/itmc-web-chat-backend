import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './Login'; // Import Login component
import Registration from './Registration'; // Assuming your registration component is in this file
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    {/* Define routes */}
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Registration />} />
    </Routes>
  </BrowserRouter>,
);
