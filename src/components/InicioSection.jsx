import React, { useEffect, useState } from 'react';
import '../styles/InicioSection.css';

function InicioSection() {
  const [alertas, setAlertas] = useState([]);

  useEffect(() => {
    const obtenerAlertas = async () => {
      try {
        const response = await fetch('http://localhost:5003/api/alertas');
        if (!response.ok) throw new Error('Error al obtener alertas');
        const data = await response.json();
        setAlertas(data);
      } catch (error) {
        console.error('Error al obtener alertas:', error);
      }
    };

    obtenerAlertas();
  }, []);

  return (
    <div className="inicio-section">
      <h1>Bienvenido al Sistema de Inventario</h1>
      <p>Aquí puedes ver las notificaciones más recientes sobre el inventario.</p>
      <div className="alertas-container">
        {alertas.length > 0 ? (
          alertas.map((alerta, index) => (
            <div
              key={index}
              className={`alert ${alerta.stock <= 1 ? 'alert-danger' : 'alert-warning'}`}
            >
              <strong>¡Atención!</strong> El producto <strong>{alerta.producto}</strong> tiene un stock de <strong>{alerta.stock}</strong>.
              {alerta.dias_desde_ingreso >= 5 && (
                <p>Han pasado <strong>{alerta.dias_desde_ingreso}</strong> días desde su ingreso.</p>
              )}
            </div>
          ))
        ) : (
          <p>No hay alertas en este momento.</p>
        )}
      </div>
    </div>
  );
}

export default InicioSection;