import React from 'react';
import '../styles/InventarioSection.css';

const InventarioSection = ({ inventario }) => {
  return (
    <div className="section-container inventario-section">
      <h2>Inventario</h2>
      <input type="text" placeholder="Buscar producto..." id="search-inventory" />
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th>Lote</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Fecha de Ingreso</th>
          </tr>
        </thead>
        <tbody>
          {inventario.map((producto) => (
            <tr key={producto.cod_producto}>
              <td>{producto.cod_producto}</td>
              <td>{producto.nombre}</td>
              <td>{producto.lote}</td>
              <td>{producto.precio}</td>
              <td>{producto.stock}</td>
              <td>{producto.fecha_ingreso}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventarioSection;
