import React, { useEffect, useState } from 'react';
import '../styles/VentasSection.css';

const VentasSection = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState('');

  // Obtener productos y ventas cuando el componente se monta
  useEffect(() => {
    fetchProductos();
    fetchVentas();
  }, []);

  // Función para obtener los productos desde el backend
  const fetchProductos = () => {
    fetch('http://localhost:5003/api/productos')
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error al obtener productos:', error));
  };

  // Función para obtener el historial de ventas
  const fetchVentas = () => {
    fetch('http://localhost:5003/api/ventas')
      .then((response) => response.json())
      .then((data) => setVentas(data))
      .catch((error) => console.error('Error al obtener ventas:', error));
  };

  // Función para registrar una venta
  const handleRegistrarVenta = () => {
    if (productoSeleccionado && cantidad > 0) {
      // Verificar si hay suficiente stock
      const producto = productos.find((prod) => prod.cod_producto === productoSeleccionado);
      if (producto.stock >= cantidad) {
        // Actualizar el inventario (reducir el stock)
        const nuevoStock = producto.stock - cantidad;

        // Actualizar producto en el inventario
        fetch(`http://localhost:5003/api/productos/${productoSeleccionado}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...producto, stock: nuevoStock }),
        })
          .then((response) => response.json())
          .then(() => {
            // Registrar la venta
            const nuevaVenta = {
              cod_producto: productoSeleccionado,
              cantidad,
              total_venta: producto.precio * cantidad,
              fecha: new Date().toLocaleDateString(),
            };

            fetch('http://localhost:5003/api/ventas', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(nuevaVenta),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.success) {
                  alert('Venta registrada exitosamente');
                  fetchVentas(); // Actualizar historial de ventas
                  setProductoSeleccionado('');
                  setCantidad('');
                } else {
                  alert('Error al registrar la venta');
                }
              })
              .catch((error) => console.error('Error al registrar la venta:', error));
          })
          .catch((error) => console.error('Error al actualizar inventario:', error));
      } else {
        alert('No hay suficiente stock disponible para esta venta');
      }
    } else {
      alert('Por favor, seleccione un producto y una cantidad válida');
    }
  };

  return (
    <div className="section-container ventas-section">
      <h2>Registrar Venta</h2>
      <form>
        <select
          value={productoSeleccionado}
          onChange={(e) => setProductoSeleccionado(e.target.value)}
          className="input-venta"
        >
          <option value="">Seleccionar Producto</option>
          {productos.map((producto) => (
            <option key={producto.cod_producto} value={producto.cod_producto}>
              {producto.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          placeholder="Cantidad"
          className="input-venta"
        />

        <button type="button" onClick={handleRegistrarVenta} className="btn-venta">
          Registrar Venta
        </button>
      </form>

      <h3>Historial de Ventas</h3>
      <table className="tabla-ventas">
        <thead>
          <tr>
            <th>ID Producto</th>
            <th>Cantidad</th>
            <th>Total Venta</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id_venta}>
              <td>{venta.cod_producto}</td>
              <td>{venta.cantidad}</td>
              <td>{venta.total_venta}</td>
              <td>{venta.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VentasSection;
