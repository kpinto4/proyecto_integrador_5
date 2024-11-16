import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/InicioSection.css';

const InicioSection = () => {
  const [productos, setProductos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const navigate = useNavigate();

  // Obtener los datos de productos desde el backend al montar el componente
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    fetch('http://localhost:5003/api/productos') // URL del backend para obtener productos
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
        verificarAlertas(data); // Verificar alertas con los datos obtenidos
      })
      .catch((error) => console.error('Error al obtener productos:', error));
  };

  const verificarAlertas = (productosData) => {
    const alertasTemp = [];
    const hoy = new Date();

    productosData.forEach((producto) => {
      // Verificar bajo stock
      if (producto.stock < 5) { // Umbral de stock bajo
        alertasTemp.push({
          mensaje: `El producto "${producto.nombre}" tiene un stock bajo (${producto.stock} unidades).`,
          accion: () => navigate('/compra'),
        });
      }

      // Verificar fecha de ingreso
      const fechaIngreso = new Date(producto.fecha_ingreso);
      const diferenciaDias = Math.ceil((hoy - fechaIngreso) / (1000 * 60 * 60 * 24));
      if (diferenciaDias >= 5 && diferenciaDias < 7) {
        alertasTemp.push({
          mensaje: `El producto "${producto.nombre}" está próximo a dañarse. Han pasado ${diferenciaDias} días desde su ingreso.`,
          accion: () => navigate('/inventario'),
        });
      }
    });

    setAlertas(alertasTemp);

    // Mostrar las alertas con SweetAlert2
    alertasTemp.forEach((alerta) => {
      Swal.fire({
        title: 'Alerta',
        text: alerta.mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ir',
        cancelButtonText: 'Cerrar',
      }).then((result) => {
        if (result.isConfirmed) {
          alerta.accion();
        }
      });
    });
  };

  return (
    <div className="section-container inicio-section">
      <h1>Bienvenido al Sistema de Inventario</h1>
      <p>Aquí puedes ver las notificaciones más recientes sobre el inventario.</p>

      {alertas.length > 0 && (
        <div className="alertas-container">
          {alertas.map((alerta, index) => (
            <div key={index} className="alerta">
              {alerta.mensaje}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InicioSection;
