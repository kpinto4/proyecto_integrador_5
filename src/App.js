// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/loginO'; // Importación en minúsculas
import Inicio from './pages/inicio'; // Importación en minúsculas
import './styles/App.css'; // Ruta corregida para apuntar a styles/App.css

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
      </Routes>
    </Router>
  );
}

export default App;
