import React, { useEffect, useState } from 'react';
import '../styles/InventarioSection.css';

const InventarioSection = () => {
  const [inventario, setInventario] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // Obtener el inventario desde el backend cuando el componente se monta
  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = () => {
    fetch('http://localhost:5003/api/productos') // URL para obtener productos desde el backend
      .then((response) => response.json())
      .then((data) => setInventario(data))
      .catch((error) => console.error('Error al obtener productos:', error));
  };

  // Función para manejar el cambio en el campo de búsqueda
  const manejarCambioBusqueda = (e) => {
    setBusqueda(e.target.value.toLowerCase());
  };

  // Filtrar el inventario por nombre de producto según la búsqueda
  const inventarioFiltrado = inventario.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda)
  );

  return (
    <div className="section-container inventario-section">
      <h2>Inventario</h2>
      <input
        type="text"
        placeholder="Buscar producto por nombre..."
        id="search-inventory"
        value={busqueda}
        onChange={manejarCambioBusqueda}
        className="input-busqueda"
      />
      <table className="tabla-inventario">
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
          {inventarioFiltrado.length > 0 ? (
            inventarioFiltrado.map((producto) => (
              <tr key={producto.cod_producto}>
                <td>{producto.cod_producto}</td>
                <td>{producto.nombre}</td>
                <td>{producto.lote}</td>
                <td>{producto.precio}</td>
                <td>{producto.stock}</td>
                <td>{producto.fecha_ingreso}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">
                No se encontraron productos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventarioSection;
