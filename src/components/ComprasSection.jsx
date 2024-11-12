import React from 'react';
import '../styles/ComprasSection.css';

const ComprasSection = () => {
  return (
    <div className="section-container compras-section">
      <h2>Registrar Compra</h2>
      <form>
        <input type="text" placeholder="Nombre del Producto" />
        <input type="number" placeholder="Cantidad" />
        <input type="number" placeholder="Precio Unitario" />
        <select>
          <option>Seleccione un Proveedor</option>
          {/* Opciones de proveedores */}
        </select>
        <button type="submit">Registrar Compra</button>
      </form>
      <h3>Historial de Compras</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Proveedor</th>
            <th>Fecha</th>
            <th>Lote</th>
          </tr>
        </thead>
        <tbody>
          {/* Filas de historial de compras */}
        </tbody>
      </table>
    </div>
  );
};

export default ComprasSection;
