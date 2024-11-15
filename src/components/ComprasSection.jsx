import React, { useEffect, useState } from 'react';
import '../styles/ComprasSection.css';

const ComprasSection = () => {
  // Estados para manejar los campos del formulario
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precioUnitario, setPrecioUnitario] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [historialCompras, setHistorialCompras] = useState([]);

  // Obtener productos y proveedores desde el backend al montar el componente
  useEffect(() => {
    fetchProductos();
    fetchProveedores();
    fetchHistorialCompras();
  }, []);

  // Función para obtener los productos desde el backend
  const fetchProductos = () => {
    fetch('http://localhost:5003/api/productos')
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error al obtener productos:', error));
  };

  // Función para obtener los proveedores desde el backend
  const fetchProveedores = () => {
    fetch('http://localhost:5003/api/proveedores')
      .then((response) => response.json())
      .then((data) => setProveedores(data))
      .catch((error) => console.error('Error al obtener proveedores:', error));
  };

  // Función para obtener el historial de compras desde el backend
  const fetchHistorialCompras = () => {
    fetch('http://localhost:5003/api/compras')
      .then((response) => response.json())
      .then((data) => setHistorialCompras(data))
      .catch((error) => console.error('Error al obtener historial de compras:', error));
  };

  // Función para manejar el registro de una nueva compra
  const manejarRegistroCompra = (e) => {
    e.preventDefault();

    // Validar que todos los campos estén completos
    if (!producto || !cantidad || !precioUnitario || !proveedor) {
      alert('Por favor, complete todos los campos antes de registrar la compra.');
      return;
    }

    // Crear un nuevo objeto de compra
    const nuevaCompra = {
      producto,
      cantidad: parseInt(cantidad),
      proveedor,
      fecha: new Date().toLocaleDateString(),
      precioUnitario: parseFloat(precioUnitario),
    };

    // Actualizar el historial de compras con la nueva compra
    fetch('http://localhost:5003/api/compras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevaCompra),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Actualizar el stock del producto
          const productoSeleccionado = productos.find((prod) => prod.nombre === producto);
          const nuevoStock = productoSeleccionado.stock + parseInt(cantidad);

          fetch(`http://localhost:5003/api/productos/${productoSeleccionado.cod_producto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...productoSeleccionado, stock: nuevoStock }),
          })
            .then((response) => response.json())
            .then(() => {
              alert('Compra registrada y stock actualizado');
              fetchHistorialCompras(); // Actualizar historial de compras
              setProducto('');
              setCantidad('');
              setPrecioUnitario('');
              setProveedor('');
            })
            .catch((error) => console.error('Error al actualizar el inventario:', error));
        } else {
          alert('Error al registrar la compra');
        }
      })
      .catch((error) => console.error('Error al registrar la compra:', error));
  };

  return (
    <div className="section-container compras-section">
      <h2>Registrar Compra</h2>
      <form onSubmit={manejarRegistroCompra}>
        <select
          value={producto}
          onChange={(e) => setProducto(e.target.value)}
          className="input-compra"
        >
          <option value="">Seleccione un Producto</option>
          {productos.map((prod) => (
            <option key={prod.cod_producto} value={prod.nombre}>
              {prod.nombre}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="input-compra"
        />

        <input
          type="number"
          placeholder="Precio Unitario"
          value={precioUnitario}
          onChange={(e) => setPrecioUnitario(e.target.value)}
          className="input-compra"
        />

        <select
          value={proveedor}
          onChange={(e) => setProveedor(e.target.value)}
          className="input-compra"
        >
          <option value="">Seleccione un Proveedor</option>
          {proveedores.map((prov) => (
            <option key={prov.id_proveedor} value={prov.nombre}>
              {prov.nombre}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-registrar">
          Registrar Compra
        </button>
      </form>

      <h3>Historial de Compras</h3>
      <table className="tabla-compras">
        <thead>
          <tr>
            <th>ID</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Proveedor</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {historialCompras.length > 0 ? (
            historialCompras.map((compra) => (
              <tr key={compra.id}>
                <td>{compra.id}</td>
                <td>{compra.producto}</td>
                <td>{compra.cantidad}</td>
                <td>{compra.proveedor}</td>
                <td>{compra.fecha}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay compras registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComprasSection;
