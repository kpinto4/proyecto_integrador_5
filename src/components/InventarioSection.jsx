import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/InventarioSection.css';

const InventarioSection = () => {
  const [inventario, setInventario] = useState([]);

  useEffect(() => {
    const fetchInventario = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/inventario');
        setInventario(response.data);
      } catch (error) {
        console.error('Error al cargar el inventario:', error);
      }
    };

    fetchInventario();
  }, []);

  return (
    <div className="inventario-section">
      <h1>Inventario</h1>
      <table>
        <thead>
          <tr>
            <th>ID Inventario</th>
            <th>Producto</th>
            <th>Lote</th>
            <th>Stock</th>
            <th>Fecha de Ingreso</th>
          </tr>
        </thead>
        <tbody>
          {inventario.length > 0 ? (
            inventario.map((item) => (
              <tr key={item.id_inventario}>
                <td>{item.id_inventario}</td>
                <td>{item.producto}</td>
                <td>{item.lote}</td>
                <td>{item.stock}</td>
                <td>{new Date(item.fechaingreso).toLocaleDateString('es-ES')}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay registros en el inventario.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventarioSection;
