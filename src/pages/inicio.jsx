import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Inventory.css';

function Inicio() {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const [inventario, setInventario] = useState([]); // Estado para guardar el inventario
  const [productos, setProductos] = useState([]); // Estado para guardar los productos
  const [proveedores, setProveedores] = useState([]); // Estado para proveedores
  const [reportes, setReportes] = useState([]); // Estado para reportes

  useEffect(() => {
    const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));
    if (!usuarioAutenticado) {
      navigate('/');
    } else {
      document.getElementById('username-display').textContent = usuarioAutenticado.username;
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuarioAutenticado');
    navigate('/');
  };

  const mostrarSeccion = (seccion) => {
    setSeccionActiva(seccion);
    if (seccion === 'inventario') cargarInventario();
    if (seccion === 'productos') cargarProductos();
    if (seccion === 'proveedor') cargarProveedores();
    if (seccion === 'reportes') cargarReportes();
  };

  const cargarInventario = async () => {
    try {
      const response = await fetch('http://localhost:5003/api/inventario');
      if (!response.ok) throw new Error('Error al cargar el inventario');
      const data = await response.json();
      setInventario(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarProductos = async () => {
    // Aquí puedes definir la lógica para cargar productos
  };

  const cargarProveedores = async () => {
    // Aquí puedes definir la lógica para cargar proveedores
  };

  const cargarReportes = async () => {
    // Aquí puedes definir la lógica para cargar reportes
  };

  return (
    <div className="inventory">
      <div id="sidebar">
        <h2>LA CANASTA</h2>
        <div id="user-info">
          <span id="username-display">Usuario</span>
          <p id="role-display">Rol</p>
        </div>
        <div className="menu-buttons">
          <button className="nav-btn" onClick={() => mostrarSeccion('inicio')}>Inicio</button>
          <button className="nav-btn" onClick={() => mostrarSeccion('inventario')}>Inventario</button>
          <button className="nav-btn" onClick={() => mostrarSeccion('productos')}>Productos</button>
          <button className="nav-btn" onClick={() => mostrarSeccion('proveedor')}>Proveedor</button>
          <button className="nav-btn" onClick={() => mostrarSeccion('reportes')}>Reportes</button>
          <button className="nav-btn" onClick={() => mostrarSeccion('compras')}>Registrar Compra</button>
          <button className="nav-btn" onClick={() => mostrarSeccion('ventas')}>Registrar Venta</button>
          <button id="logout-btn" onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
      </div>

      <div id="content-section">
        {seccionActiva === 'inicio' && (
          <div id="inicio-section" className="table-section">
            <h1>Bienvenido al Sistema de Inventario</h1>
            <p>Aquí puedes ver las notificaciones más recientes sobre el inventario.</p>
          </div>
        )}

        {seccionActiva === 'inventario' && (
          <div id="inventario-section" className="table-section">
            <h1>Inventario</h1>
          </div>
        )}

        {seccionActiva === 'productos' && (
          <div id="productos-section" className="table-section">
            <h2>Lista de Productos</h2>
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Lote</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Fecha de Ingreso</th>
                </tr>
              </thead>
              <tbody>
                {inventario.map((producto) => (
                  <tr key={producto.cod_producto}>
                    <td>{producto.cod_producto}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.lote}</td>
                    <td>{producto.precio}</td>
                    <td>{producto.stock}</td>
                    <td>{producto.fecha_ingreso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {seccionActiva === 'proveedor' && (
          <div id="proveedor-section" className="table-section">
            <h2>Gestionar Proveedores</h2>
            {/* Tabla o lista de proveedores */}
          </div>
        )}

        {seccionActiva === 'reportes' && (
          <div id="reportes-section" className="table-section">
            <h2>Reportes Históricos</h2>
            {/* Tabla o lista de reportes */}
          </div>
        )}

        {seccionActiva === 'compras' && (
          <div id="compras-section" className="table-section">
            <h2>Registrar Compra</h2>
            {/* Formulario para registrar compras */}
          </div>
        )}

        {seccionActiva === 'ventas' && (
          <div id="ventas-section" className="table-section">
            <h2>Registrar Venta</h2>
            {/* Formulario para registrar ventas */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inicio;
