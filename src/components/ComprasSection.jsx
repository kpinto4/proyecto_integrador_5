import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ComprasSection.css';

const ComprasSection = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [compra, setCompra] = useState({
    cod_producto: '',
    cantidad: '',
    precio_unitario: '',
    id_proveedor: '',
  });
  const [historialCompras, setHistorialCompras] = useState([]);
  const [mensaje, setMensaje] = useState('');

  // Obtener productos y proveedores al cargar la página
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/proveedores');
        setProveedores(response.data);
      } catch (error) {
        console.error('Error al cargar proveedores:', error);
      }
    };

    const fetchHistorialCompras = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/compras');
        setHistorialCompras(response.data);
      } catch (error) {
        console.error('Error al cargar el historial de compras:', error);
      }
    };

    fetchProductos();
    fetchProveedores();
    fetchHistorialCompras();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Actualizar cantidad y recalcular el precio total
    if (name === 'cantidad') {
      const productoSeleccionado = productos.find(
        (producto) => producto.id === parseInt(compra.cod_producto)
      );
      const precio = productoSeleccionado ? productoSeleccionado.precio : 0;

      setCompra({
        ...compra,
        cantidad: value,
        precio_unitario: precio * parseInt(value || 0),
      });
    } else if (name === 'cod_producto') {
      const productoSeleccionado = productos.find(
        (producto) => producto.id === parseInt(value)
      );
      const precio = productoSeleccionado ? productoSeleccionado.precio : 0;

      setCompra({
        ...compra,
        cod_producto: value,
        precio_unitario: precio * parseInt(compra.cantidad || 0),
      });
    } else {
      setCompra({ ...compra, [name]: value });
    }
  };

  // Registrar compra
  const registrarCompra = async () => {
    try {
      if (!compra.cod_producto || !compra.cantidad || !compra.id_proveedor) {
        setMensaje('Por favor, completa todos los campos.');
        return;
      }

      const response = await axios.post('http://localhost:5003/api/compras', compra);
      setHistorialCompras([...historialCompras, response.data]);
      setMensaje('Compra registrada exitosamente.');

      // Limpiar el formulario
      setCompra({
        cod_producto: '',
        cantidad: '',
        precio_unitario: '',
        id_proveedor: '',
      });
    } catch (error) {
      console.error('Error al registrar la compra:', error);
      setMensaje('Hubo un error al registrar la compra.');
    }
  };

  return (
    <div className="compras-section">
      <h1>Registrar Compra</h1>
      <form>
        <select
          name="cod_producto"
          value={compra.cod_producto}
          onChange={handleInputChange}
        >
          <option value="">Seleccione un Producto</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={compra.cantidad}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="precio_unitario"
          placeholder="Precio Total"
          value={compra.precio_unitario}
          readOnly
        />
        <select
          name="id_proveedor"
          value={compra.id_proveedor}
          onChange={handleInputChange}
        >
          <option value="">Seleccione un Proveedor</option>
          {proveedores.map((proveedor) => (
            <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
              {proveedor.nombre}
            </option>
          ))}
        </select>
        <button type="button" onClick={registrarCompra}>
          Registrar Compra
        </button>
      </form>
      {mensaje && <p>{mensaje}</p>}
      <h2>Historial de Compras</h2>
      <table>
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
              <tr key={compra.id_compra}>
                <td>{compra.id_compra}</td>
                <td>{compra.producto}</td>
                <td>{compra.cantidad}</td>
                <td>{compra.proveedor}</td>
                <td>{new Date(compra.fecha).toLocaleDateString('es-ES')}</td>
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
