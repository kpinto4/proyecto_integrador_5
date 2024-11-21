import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/VentasSection.css';

const VentasSection = () => {
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [nuevaVenta, setNuevaVenta] = useState({
    cod_producto: '',
    cantidad: '',
  });
  const [totalEstimado, setTotalEstimado] = useState(0);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    const fetchVentas = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/ventas');
        setVentas(response.data);
      } catch (error) {
        console.error('Error al cargar el historial de ventas:', error);
      }
    };

    fetchProductos();
    fetchVentas();
  }, []);

  useEffect(() => {
    if (nuevaVenta.cod_producto && nuevaVenta.cantidad) {
      const productoSeleccionado = productos.find(
        (prod) => prod.id === parseInt(nuevaVenta.cod_producto)
      );
      if (productoSeleccionado) {
        setTotalEstimado(productoSeleccionado.precio * nuevaVenta.cantidad);
      }
    } else {
      setTotalEstimado(0);
    }
  }, [nuevaVenta, productos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaVenta({ ...nuevaVenta, [name]: value });
  };

  const registrarVenta = async () => {
    try {
      if (!nuevaVenta.cod_producto || !nuevaVenta.cantidad) {
        alert('Por favor, selecciona un producto y especifica la cantidad.');
        return;
      }

      const response = await axios.post('http://localhost:5003/api/ventas', nuevaVenta);
      setVentas([...ventas, response.data]);
      setNuevaVenta({ cod_producto: '', cantidad: '' });
      setTotalEstimado(0);
      alert('Venta registrada exitosamente.');
    } catch (error) {
      console.error('Error al registrar la venta:', error);
      alert('Hubo un error al registrar la venta.');
    }
  };

  return (
    <div className="section-container">
      <h1>Registrar Venta</h1>
      <div className="venta-form">
        <div className="form-group">
          <select
            name="cod_producto"
            value={nuevaVenta.cod_producto}
            onChange={handleInputChange}
          >
            <option value="">Seleccionar Producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre} (Stock: {producto.stock})
              </option>
            ))}
          </select>
          <input
            type="number"
            name="cantidad"
            placeholder="Cantidad"
            value={nuevaVenta.cantidad}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <span>Total Estimado: ${totalEstimado}</span>
          <button onClick={registrarVenta}>Registrar Venta</button>
        </div>
      </div>
      <h2>Historial de Ventas</h2>
      <table>
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Total Venta</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id_venta}>
              <td>{venta.id_venta}</td>
              <td>{venta.producto}</td>
              <td>{venta.cantidad}</td>
              <td>${venta.total_venta}</td>
              <td>{new Date(venta.fecha).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VentasSection;
