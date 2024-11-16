import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginSection.css'; // Importa los estilos específicos para la sección de login

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Credenciales de prueba hardcodeadas
  const usuarioPrueba = {
    username: 'admin',
    password: 'admin123'
  };

  const handleLogin = () => {
    // Verifica si los datos ingresados coinciden con los de prueba
    if (username === usuarioPrueba.username && password === usuarioPrueba.password) {
      // Guarda el usuario en localStorage para simular la autenticación
      localStorage.setItem('usuarioAutenticado', JSON.stringify({ username }));
      navigate('/inicio'); // Redirige a la página de inicio
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Iniciar Sesión</button>
      </div>
    </div>
  );
}

export default Login;
