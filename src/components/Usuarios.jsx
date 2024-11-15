import React, { useEffect, useState } from 'react';
import '../styles/UsuariosSection.css';

const UsuariosSection = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEditable, setUsuarioEditable] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [cargo, setCargo] = useState('administrador');

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    fetch('http://localhost:5003/api/usuarios')
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => console.error('Error al obtener usuarios:', error));
  };

  const resetForm = () => {
    setNombre('');
    setApellido('');
    setCorreo('');
    setTelefono('');
    setCargo('administrador');
    setUsuarioEditable(null);
  };

  const handleSave = () => {
    const method = usuarioEditable ? 'PUT' : 'POST';
    const url = usuarioEditable
      ? `http://localhost:5003/api/usuarios/${usuarioEditable.id}`
      : 'http://localhost:5003/api/usuarios';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, correo, telefono, cargo }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(`Usuario ${usuarioEditable ? 'actualizado' : 'agregado'} exitosamente`);
          fetchUsuarios();
          resetForm();
        } else {
          alert('Error al guardar usuario');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  const handleEdit = (usuario) => {
    setUsuarioEditable(usuario);
    setNombre(usuario.nombre);
    setApellido(usuario.apellido);
    setCorreo(usuario.correo);
    setTelefono(usuario.telefono);
    setCargo(usuario.cargo);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5003/api/usuarios/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Usuario eliminado exitosamente');
          fetchUsuarios();
        } else {
          alert('Error al eliminar usuario');
        }
      })
      .catch((error) => console.error('Error al eliminar usuario:', error));
  };

  return (
    <div className="section-container">
      <h2>Gestionar Usuarios</h2>
      <form className="formulario-usuario">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input-usuario"
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          className="input-usuario"
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          className="input-usuario"
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="input-usuario"
        />
        <select
          value={cargo}
          onChange={(e) => setCargo(e.target.value)}
          className="input-usuario"
        >
          <option value="administrador">Administrador</option>
          <option value="gestor_inventario">Gestor de Inventario</option>
          <option value="directivo">Directivo</option>
        </select>
        <button type="button" onClick={handleSave} className="btn-usuario">
          {usuarioEditable ? 'Actualizar' : 'Agregar'} Usuario
        </button>
      </form>

      <h3>Lista de Usuarios</h3>
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Cargo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellido}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.cargo}</td>
              <td>
                <button onClick={() => handleEdit(usuario)} className="btn-accion">
                  Editar
                </button>
                <button onClick={() => handleDelete(usuario.id)} className="btn-accion">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsuariosSection;
