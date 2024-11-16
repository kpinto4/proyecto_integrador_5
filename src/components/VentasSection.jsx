import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/VentasSection.css';

const VentasSection = () => {
  const [productos, setProductos] = useState([]); // Lista de productos disponibles
  const [venta, setVenta] = useState({
    id_producto: '',
    cantidad: '',
  });
  const [mensaje, setMensaje] = useState(''); // Mensajes de éxito o error

  // Obtener productos al cargar la página
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/inventario'); // Ajusta la ruta según tu backend
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProductos();
  }, []);

  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVenta({ ...venta, [name]: value });
  };

  // Registrar la venta
  const registrarVenta = async () => {
    try {
      if (!venta.id_producto || !venta.cantidad || venta.cantidad <= 0) {
        setMensaje('Por favor, selecciona un producto y una cantidad válida.');
        return;
      }

      const productoSeleccionado = productos.find(
        (producto) => producto.cod_producto === parseInt(venta.id_producto)
      );

      if (!productoSeleccionado) {
        setMensaje('Producto no encontrado.');
        return;
      }

      const totalVenta = productoSeleccionado.precio * venta.cantidad;

      const response = await axios.post('http://localhost:5003/api/ventas', {
        id_producto: venta.id_producto,
        cantidad: venta.cantidad,
      });

      setMensaje(response.data.message);

      // Actualizar la lista de productos para reflejar el nuevo stock
      setProductos((prevProductos) =>
        prevProductos.map((producto) =>
          producto.cod_producto === parseInt(venta.id_producto)
            ? { ...producto, stock: producto.stock - venta.cantidad }
            : producto
        )
      );

      // Limpiar el formulario
      setVenta({ id_producto: '', cantidad: '' });
    } catch (error) {
      console.error('Error al registrar la venta:', error.response || error.message);
      setMensaje('Hubo un error al registrar la venta.');
    }
  };

  return (
    <div className="ventas-section">
      <h1>Registrar Venta</h1>
      <form>
        <select
          name="id_producto"
          value={venta.id_producto}
          onChange={handleInputChange}
        >
          <option value="">Seleccionar Producto</option>
          {productos.map((producto) => (
            <option key={producto.cod_producto} value={producto.cod_producto}>
              {producto.nombre} (Stock: {producto.stock})
            </option>
          ))}
        </select>
        <input
          type="number"
          name="cantidad"
          placeholder="Cantidad"
          value={venta.cantidad}
          onChange={handleInputChange}
        />
        <button type="button" onClick={registrarVenta}>
          Registrar Venta
        </button>
      </form>
      {mensaje && <p>{mensaje}</p>}
      <h2>Historial de Ventas</h2>
      {/* Aquí puedes agregar una tabla para mostrar el historial de ventas */}
    </div>
  );
};

export default VentasSection;
