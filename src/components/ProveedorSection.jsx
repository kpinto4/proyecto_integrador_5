import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProveedorSection.css';

const ProveedorSection = () => {
  const [proveedores, setProveedores] = useState([]);
  const [nuevoProveedor, setNuevoProveedor] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    correo_electronico: '',
    departamento: '',
    estado: 'Activo',
  });
  const [editando, setEditando] = useState(false);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);

  // Obtener proveedores al cargar la página
  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/proveedores');
        setProveedores(response.data);
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
      }
    };

    fetchProveedores();
  }, []);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProveedor({ ...nuevoProveedor, [name]: value });
  };

  // Agregar un nuevo proveedor
  const agregarProveedor = async () => {
    try {
      if (!nuevoProveedor.nombre || !nuevoProveedor.direccion || !nuevoProveedor.ciudad || !nuevoProveedor.telefono) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
      }

      const response = await axios.post('http://localhost:5003/api/proveedores', nuevoProveedor);

      setProveedores([...proveedores, response.data]); // Actualizar la lista
      setNuevoProveedor({
        nombre: '',
        direccion: '',
        ciudad: '',
        telefono: '',
        correo_electronico: '',
        departamento: '',
        estado: 'Activo',
      });
      alert('Proveedor agregado exitosamente.');
    } catch (error) {
      console.error('Error al agregar proveedor:', error.response || error.message);
      alert('Hubo un error al agregar el proveedor.');
    }
  };

  // Iniciar edición de un proveedor
  const iniciarEdicion = (proveedor) => {
    setEditando(true);
    setProveedorSeleccionado(proveedor);
    setNuevoProveedor({ ...proveedor });
  };

  // Guardar los cambios de un proveedor
  const guardarEdicion = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5003/api/proveedores/${proveedorSeleccionado.id_proveedor}`,
        nuevoProveedor
      );

      setProveedores(
        proveedores.map((prov) =>
          prov.id_proveedor === proveedorSeleccionado.id_proveedor ? response.data : prov
        )
      );

      setEditando(false);
      setProveedorSeleccionado(null);
      setNuevoProveedor({
        nombre: '',
        direccion: '',
        ciudad: '',
        telefono: '',
        correo_electronico: '',
        departamento: '',
        estado: 'Activo',
      });

      alert('Proveedor actualizado exitosamente.');
    } catch (error) {
      console.error('Error al actualizar proveedor:', error.response || error.message);
      alert('Hubo un error al actualizar el proveedor.');
    }
  };

  // Eliminar un proveedor
  const eliminarProveedor = async (id) => {
    try {
      await axios.delete(`http://localhost:5003/api/proveedores/${id}`);

      setProveedores(proveedores.filter((prov) => prov.id_proveedor !== id));
      alert('Proveedor eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar proveedor:', error.response || error.message);
      alert('Hubo un error al eliminar el proveedor.');
    }
  };

  return (
    <div className="section-container">
      <div className="proveedor-section">
        <h1>Gestionar Proveedores</h1>
        <form>
          <input
            type="text"
            placeholder="Nombre del Proveedor"
            name="nombre"
            value={nuevoProveedor.nombre}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Dirección"
            name="direccion"
            value={nuevoProveedor.direccion}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Ciudad"
            name="ciudad"
            value={nuevoProveedor.ciudad}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Teléfono"
            name="telefono"
            value={nuevoProveedor.telefono}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Correo Electrónico"
            name="correo_electronico"
            value={nuevoProveedor.correo_electronico}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Departamento"
            name="departamento"
            value={nuevoProveedor.departamento}
            onChange={handleInputChange}
          />
          <select name="estado" value={nuevoProveedor.estado} onChange={handleInputChange}>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          {!editando ? (
            <button type="button" onClick={agregarProveedor}>Agregar Proveedor</button>
          ) : (
            <>
              <button type="button" onClick={guardarEdicion}>Guardar Cambios</button>
              <button type="button" onClick={() => setEditando(false)}>Cancelar</button>
            </>
          )}
        </form>
        <table>
          <thead>
            <tr>
              <th>ID</th>
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
                  <button onClick={() => iniciarEdicion(proveedor)}>Editar</button>
                  <button onClick={() => eliminarProveedor(proveedor.id_proveedor)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProveedorSection;