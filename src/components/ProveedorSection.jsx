import React, { useEffect, useState } from 'react';
import '../styles/ProveedorSection.css';

const ProveedorSection = () => {
  const [proveedores, setProveedores] = useState([]);
  const [proveedorEditable, setProveedorEditable] = useState(null);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [estado, setEstado] = useState('activo');
  const [codigo, setCodigo] = useState(''); // Para almacenar el id_proveedor
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [departamento, setDepartamento] = useState('');

  // Al cargar el componente, obtener la lista de proveedores
  useEffect(() => {
    fetchProveedores();
  }, []);

  // Función para obtener proveedores desde el servidor
  const fetchProveedores = () => {
    fetch('http://localhost:5003/api/proveedores')
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((error) => console.error('Error al obtener proveedores:', error));
  };

  // Función para limpiar el formulario
  const resetForm = () => {
    setNombre('');
    setDireccion('');
    setCiudad('');
    setTelefono('');
    setEstado('activo');
    setCodigo('');
    setCorreoElectronico('');
    setDepartamento('');
    setProveedorEditable(null);
  };

  // Función para guardar (agregar o actualizar) un proveedor
  const handleSave = () => {
    const method = proveedorEditable ? 'PUT' : 'POST';
    const url = proveedorEditable
      ? `http://localhost:5003/api/proveedores/${codigo}`
      : 'http://localhost:5003/api/proveedores';

    // Agregar console.log para depurar
    console.log('Enviando solicitud a:', url); // Muestra la URL
    console.log('Método:', method); // Muestra el método (POST o PUT)
    console.log('Datos enviados:', { 
      nombre, 
      direccion, 
      ciudad, 
      telefono, 
      estado, 
      correo_electronico: correoElectronico, 
      departamento 
    }); // Muestra los datos

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        direccion,
        ciudad,
        telefono,
        estado,
        correo_electronico: correoElectronico,
        departamento,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Respuesta del servidor:', data); // Muestra la respuesta
        if (data.success) {
          alert(`Proveedor ${proveedorEditable ? 'actualizado' : 'agregado'} exitosamente`);
          fetchProveedores(); // Actualizar la lista de proveedores
          resetForm();
        } else {
          alert('Error al guardar proveedor');
        }
      })
      .catch((error) => console.error('Error:', error));
  };

  // Función para manejar la edición de un proveedor
  const handleEdit = (proveedor) => {
    setProveedorEditable(proveedor);
    setCodigo(proveedor.id_proveedor);
    setNombre(proveedor.nombre);
    setDireccion(proveedor.direccion);
    setCiudad(proveedor.ciudad);
    setTelefono(proveedor.telefono);
    setEstado(proveedor.estado);
  };

  // Función para eliminar un proveedor
  const handleDelete = (id_proveedor) => {
    fetch(`http://localhost:5003/api/proveedores/${id_proveedor}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Proveedor eliminado exitosamente');
          fetchProveedores(); // Actualizar la lista de proveedores
        } else {
          alert('Error al eliminar proveedor');
        }
      })
      .catch((error) => console.error('Error al eliminar proveedor:', error));
  };

  return (
    <div className="section-container proveedor-section">
      <h2>Gestionar Proveedores</h2>
      <form>
        {proveedorEditable && (
          <input
            type="text"
            placeholder="Código del Proveedor"
            value={codigo}
            readOnly
          />
        )}
        <input
          type="text"
          placeholder="Nombre del Proveedor"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dirección"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          value={correoElectronico}
          onChange={(e) => setCorreoElectronico(e.target.value)}
        />
        <input
          type="text"
          placeholder="Departamento"
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
        />
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
        <button type="button" onClick={handleSave}>
          {proveedorEditable ? 'Actualizar' : 'Agregar'} Proveedor
        </button>
      </form>

      <h3>Lista de Proveedores</h3>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Ciudad</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor) => (
            <tr key={proveedor.id_proveedor}>
              <td>{proveedor.id_proveedor}</td>
              <td>{proveedor.nombre}</td>
              <td>{proveedor.direccion}</td>
              <td>{proveedor.ciudad}</td>
              <td>{proveedor.telefono}</td>
              <td>{proveedor.estado}</td>
              <td className="acciones">
                <button onClick={() => handleEdit(proveedor)}>Editar</button>
                <button onClick={() => handleDelete(proveedor.id_proveedor)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProveedorSection;
