import React, { useEffect, useState } from 'react';
import '../styles/ReportesSection.css';

const ReportesSection = () => {
  // Estados para almacenar los datos de cada reporte
  const [ventas, setVentas] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [compras, setCompras] = useState([]);
  const [desempenoProductos, setDesempenoProductos] = useState([]);
  const [financiero, setFinanciero] = useState(null);

  // Función para obtener los reportes desde el backend
  useEffect(() => {
    fetchVentas();
    fetchInventario();
    fetchCompras();
    fetchDesempenoProductos();
    fetchReporteFinanciero();
  }, []);

  // Función para obtener ventas desde el backend
  const fetchVentas = () => {
    fetch('http://localhost:5003/api/ventas')
      .then((response) => response.json())
      .then((data) => setVentas(data))
      .catch((error) => console.error('Error al obtener ventas:', error));
  };

  // Función para obtener inventario desde el backend
  const fetchInventario = () => {
    fetch('http://localhost:5003/api/productos')
      .then((response) => response.json())
      .then((data) => setInventario(data))
      .catch((error) => console.error('Error al obtener inventario:', error));
  };

  // Función para obtener compras desde el backend
  const fetchCompras = () => {
    fetch('http://localhost:5003/api/compras')
      .then((response) => response.json())
      .then((data) => setCompras(data))
      .catch((error) => console.error('Error al obtener compras:', error));
  };

  // Función para obtener desempeño de productos desde el backend
  const fetchDesempenoProductos = () => {
    fetch('http://localhost:5003/api/desempenoProductos')
      .then((response) => response.json())
      .then((data) => setDesempenoProductos(data))
      .catch((error) => console.error('Error al obtener desempeño de productos:', error));
  };

  // Función para obtener reporte financiero
  const fetchReporteFinanciero = () => {
    fetch('http://localhost:5003/api/reporteFinanciero')
      .then((response) => response.json())
      .then((data) => setFinanciero(data))
      .catch((error) => console.error('Error al obtener reporte financiero:', error));
  };

  return (
    <div className="section-container reportes-section">
      <h2>Reportes Históricos</h2>

      {/* Reporte de Ventas */}
      <h3>Reporte de Ventas</h3>
      {ventas.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id_venta}>
                <td>{venta.id_venta}</td>
                <td>{venta.fecha}</td>
                <td>{venta.producto}</td>
                <td>{venta.cantidad}</td>
                <td>${venta.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay ventas registradas.</p>
      )}

      {/* Reporte de Inventario */}
      <h3>Reporte de Inventario</h3>
      {inventario.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Fecha de Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {inventario.map((producto) => (
              <tr key={producto.cod_producto}>
                <td>{producto.cod_producto}</td>
                <td>{producto.nombre}</td>
                <td>{producto.stock}</td>
                <td>${producto.precio.toFixed(2)}</td>
                <td>{producto.fecha_ingreso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay datos de inventario.</p>
      )}

      {/* Reporte de Compras (Incluye Proveedores) */}
      <h3>Reporte de Compras</h3>
      {compras.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Proveedor</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {compras.map((compra) => (
              <tr key={compra.id_compra}>
                <td>{compra.id_compra}</td>
                <td>{compra.fecha}</td>
                <td>{compra.producto}</td>
                <td>{compra.cantidad}</td>
                <td>{compra.proveedor}</td>
                <td>${compra.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay compras registradas.</p>
      )}

      {/* Reporte de Desempeño de Productos */}
      <h3>Reporte de Desempeño de Productos</h3>
      {desempenoProductos.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad Vendida</th>
              <th>Ingresos Generados</th>
            </tr>
          </thead>
          <tbody>
            {desempenoProductos.map((producto) => (
              <tr key={producto.nombre}>
                <td>{producto.nombre}</td>
                <td>{producto.cantidadVendida}</td>
                <td>${producto.ingresos.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay datos de desempeño de productos.</p>
      )}

      {/* Reporte Financiero */}
      <h3>Reporte Financiero</h3>
      {financiero ? (
        <div className="reporte-financiero">
          <p><strong>Ingresos Totales:</strong> ${financiero.ingresosTotales.toFixed(2)}</p>
          <p><strong>Gastos Totales:</strong> ${financiero.gastosTotales.toFixed(2)}</p>
          <p><strong>Ganancia Neta:</strong> ${financiero.gananciaNeta.toFixed(2)}</p>
        </div>
      ) : (
        <p>No hay datos financieros.</p>
      )}
    </div>
  );
};

export default ReportesSection;
