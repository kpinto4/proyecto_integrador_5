import React from 'react';
import '../styles/VentasSection.css';

const VentasSection = () => {
  return (
    <div className="section-container ventas-section">
      <h2>Registrar Venta</h2>
      <form>
        <input type="text" placeholder="ID del Producto" />
        <input type="number" placeholder="Cantidad" />
        <button type="submit">Registrar Venta</button>
      </form>
      <h3>Historial de Ventas</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {/* Filas de historial de ventas */}
        </tbody>
      </table>
    </div>
  );
};

export default VentasSection;
