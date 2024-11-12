import React from 'react';
import '../styles/ProveedorSection.css';

const ProveedorSection = ({ proveedores }) => {
  return (
    <div className="section-container proveedor-section">
      <h2>Gestionar Proveedores</h2>
      <form>
        <input type="text" placeholder="Nombre del Proveedor" />
        <input type="text" placeholder="Dirección" />
        <input type="text" placeholder="Ciudad" />
        <input type="text" placeholder="Teléfono" />
        <select>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
        <button type="submit">Agregar/Modificar Proveedor</button>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProveedorSection;
