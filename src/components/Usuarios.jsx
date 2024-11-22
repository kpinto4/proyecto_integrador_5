import React, { useState, useEffect } from 'react';
import '../styles/UsuariosSection.css';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cargo, setCargo] = useState('Empleado');
  const [enEdicion, setEnEdicion] = useState(false);
  const [idUsuarioActual, setIdUsuarioActual] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/usuarios');
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  const handleAgregar = async () => {
    try {
      const nuevoUsuario = { nombre, apellido, username, password, cargo };
      await fetch('http://localhost:5002/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario),
      });
      cargarUsuarios();
      limpiarCampos();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
    }
  };

  const handleEditarClick = (usuario) => {
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setUsername(usuario.username);
    setPassword(usuario.password);
    setCargo(usuario.cargo);
    setIdUsuarioActual(usuario.id);
    setEnEdicion(true);
  };

  const handleActualizar = async () => {
    try {
      const usuarioActualizado = { nombre, apellido, username, password, cargo };
      await fetch(`http://localhost:5002/api/usuarios/${idUsuarioActual}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioActualizado),
      });
      cargarUsuarios();
      limpiarCampos();
      setEnEdicion(false);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await fetch(`http://localhost:5002/api/usuarios/${id}`, { method: 'DELETE' });
      cargarUsuarios();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleCancelar = () => {
    limpiarCampos();
    setEnEdicion(false);
  };

  const limpiarCampos = () => {
    setNombre('');
    setApellido('');
    setUsername('');
    setPassword('');
    setCargo('Empleado');
    setIdUsuarioActual(null);
  };

  return (
    <div className="usuarios-container">
      <h2>Gestión de Usuarios</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />
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
        <select value={cargo} onChange={(e) => setCargo(e.target.value)}>
          <option value="Empleado">Empleado</option>
          <option value="Administrador">Administrador</option>
        </select>
        <div className="form-actions">
          {enEdicion ? (
            <>
              <button className="btn btn-primary" onClick={handleActualizar}>
                Actualizar
              </button>
              <button className="btn btn-secondary" onClick={handleCancelar}>
                Cancelar
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={handleAgregar}>
              Agregar
            </button>
          )}
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Usuario</th>
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.username}</td>
              <td>{usuario.cargo}</td>
              <td>
                <button
                  className="btn btn-edit"
                  onClick={() => handleEditarClick(usuario)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleEliminar(usuario.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Usuarios;