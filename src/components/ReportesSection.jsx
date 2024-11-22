import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/ReportesSection.css';

const ReportesSection = () => {
  const [reporteVentas, setReporteVentas] = useState(null);
  const [reporteCompras, setReporteCompras] = useState(null);
  const [reporteFinanciero, setReporteFinanciero] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarReporteVentas();
    cargarReporteCompras();
    cargarReporteFinanciero();
  }, []);

  const cargarReporteVentas = async () => {
    try {
      const response = await axios.get('http://localhost:5003/api/reportes/ventas');
      setReporteVentas(response.data);
    } catch (error) {
      console.error('Error al cargar el reporte de ventas:', error);
      setError('Error al cargar el reporte de ventas.');
    }
  };

  const cargarReporteCompras = async () => {
    try {
      const response = await axios.get('http://localhost:5003/api/reportes/compras');
      setReporteCompras(response.data);
    } catch (error) {
      console.error('Error al cargar el reporte de compras:', error);
      setError('Error al cargar el reporte de compras.');
    }
  };

  const cargarReporteFinanciero = async () => {
    try {
      const response = await axios.get('http://localhost:5003/api/reportes/financiero');
      setReporteFinanciero(response.data);
    } catch (error) {
      console.error('Error al cargar el reporte financiero:', error);
      setError('Error al cargar el reporte financiero.');
    }
  };

  return (
    <div className="reportes-container">
      <h1 className="reportes-title">Reportes Históricos</h1>

      {error && <p className="error-message">{error}</p>}

      {/* Reporte de Ventas */}
      <div className="reporte">
        <h2 className="reporte-subtitle">Reporte de Ventas</h2>
        {reporteVentas ? (
          <table className="reporte-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad Vendida</th>
                <th>Última Venta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{reporteVentas.producto || 'N/A'}</td>
                <td>{reporteVentas.cantidad_vendida || 0}</td>
                <td>{reporteVentas.ultima_venta || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No hay datos disponibles para el reporte de ventas.</p>
        )}
      </div>

      {/* Reporte de Compras */}
      <div className="reporte">
        <h2 className="reporte-subtitle">Reporte de Compras</h2>
        {reporteCompras ? (
          <table className="reporte-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad Comprada</th>
                <th>Última Compra</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{reporteCompras.producto || 'N/A'}</td>
                <td>{reporteCompras.cantidad_comprada || 0}</td>
                <td>{reporteCompras.ultima_compra || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No hay datos disponibles para el reporte de compras.</p>
        )}
      </div>

      {/* Reporte Financiero */}
      <div className="reporte">
        <h2 className="reporte-subtitle">Reporte Financiero</h2>
        {reporteFinanciero ? (
          <table className="reporte-table">
            <thead>
              <tr>
                <th>Total de Ventas</th>
                <th>Total de Compras</th>
                <th>Ganancias</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{reporteFinanciero.total_ventas || 0}</td>
                <td>{reporteFinanciero.total_compras || 0}</td>
                <td>{reporteFinanciero.ganancias || 0}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No hay datos disponibles para el reporte financiero.</p>
        )}
      </div>
    </div>
  );
};

export default ReportesSection;