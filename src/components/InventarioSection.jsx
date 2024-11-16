import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/InventarioSection.css';

const InventarioSection = () => {
  const [productos, setProductos] = useState([]); // Todos los productos
  const [filtro, setFiltro] = useState(''); // Texto ingresado en la barra de búsqueda

  // Obtener productos desde el backend
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/inventario');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProductos();
  }, []);

  // Filtrar productos en tiempo real
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="inventario-section">
      <h1>Inventario</h1>
      <input
        id="search-inventory"
        type="text"
        placeholder="Buscar producto por nombre..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)} // Actualiza el filtro en tiempo real
      />
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
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map((producto) => (
              <tr key={producto.cod_producto}>
                <td>{producto.cod_producto}</td>
                <td>{producto.nombre}</td>
                <td>{producto.lote}</td>
                <td>{producto.precio}</td>
                <td>{producto.stock}</td>
                <td>{new Date(producto.fecha_ingreso).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="no-data">No se encontraron productos</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default InventarioSection;