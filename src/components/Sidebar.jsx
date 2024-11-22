import React from 'react';
import { FaCog } from 'react-icons/fa';
import '../styles/Sidebar.css';

function Sidebar({ mostrarSeccion, cerrarSesion, cargoUsuario }) {
  return (
    <div id="sidebar">
      <h2>LA CANASTA</h2>
      <div id="user-info">
        <div id="username-row">
          <span id="username-display">admin</span>
          {/* Muestra el ícono de configuración solo para Administradores */}
          {cargoUsuario === 'Administrador' && (
            <FaCog
              className="gear-icon"
              title="Gestionar Usuarios"
              onClick={() => mostrarSeccion('usuarios')}
            />
          )}
        </div>
        <p id="role-display">{cargoUsuario}</p>
      </div>
      <div className="menu-buttons">
        <button onClick={() => mostrarSeccion('inicio')}>Inicio</button>
        <button onClick={() => mostrarSeccion('inventario')}>Inventario</button>
        <button onClick={() => mostrarSeccion('productos')}>Productos</button>
        <button onClick={() => mostrarSeccion('proveedor')}>Proveedor</button>
        {/* Botón Reportes visible solo para Administradores */}
        {cargoUsuario === 'Administrador' && (
          <button onClick={() => mostrarSeccion('reportes')}>Reportes</button>
        )}
        <button onClick={() => mostrarSeccion('compras')}>Compra</button>
        <button onClick={() => mostrarSeccion('ventas')}>Venta</button>
        <button id="logout-btn" onClick={cerrarSesion}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Sidebar;