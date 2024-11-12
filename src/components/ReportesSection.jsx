import React from 'react';
import '../styles/ReportesSection.css';

const ReportesSection = ({ reportes }) => {
  return (
    <div className="section-container reportes-section">
      <h2>Reportes Históricos</h2>
      {reportes.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((reporte) => (
              <tr key={reporte.id_reporte}>
                <td>{reporte.id_reporte}</td>
                <td>{reporte.fecha}</td>
                <td>{reporte.descripcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay reportes disponibles.</p>
      )}
    </div>
  );
};

export default ReportesSection;
