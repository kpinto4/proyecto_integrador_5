import React from 'react';
import '../styles/Sidebar.css'; // Importa los estilos específicos para el Sidebar

function Sidebar({ mostrarSeccion, cerrarSesion }) {
  return (
    <div id="sidebar">
      <h2>LA CANASTA</h2>
      <div id="user-info">
        <span id="username-display">Usuario</span>
        <p id="role-display">Rol</p>
      </div>
      <div className="menu-buttons">
        <button onClick={() => mostrarSeccion('inicio')}>Inicio</button>
        <button onClick={() => mostrarSeccion('inventario')}>Inventario</button>
        <button onClick={() => mostrarSeccion('productos')}>Productos</button>
        <button onClick={() => mostrarSeccion('proveedor')}>Proveedor</button>
        <button onClick={() => mostrarSeccion('reportes')}>Reportes</button>
        <button onClick={() => mostrarSeccion('compras')}>Registrar Compra</button>
        <button onClick={() => mostrarSeccion('ventas')}>Registrar Venta</button>
        <button id="logout-btn" onClick={cerrarSesion}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Sidebar;
