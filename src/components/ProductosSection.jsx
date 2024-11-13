import React from 'react';
import '../styles/ProductosSection.css';

const ProductosSection = ({ productos }) => {
  return (
    <div className="section-container productos-section">
      <h2>Lista de Productos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Lote</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Fecha de Ingreso</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
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

export default ProductosSection;
