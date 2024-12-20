import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import InicioSection from '../components/InicioSection';
import InventarioSection from '../components/InventarioSection';
import ProductosSection from '../components/ProductosSection';
import ProveedorSection from '../components/ProveedorSection';
import ReportesSection from '../components/ReportesSection';
import ComprasSection from '../components/ComprasSection';
import VentasSection from '../components/VentasSection';
import Usuarios from '../components/Usuarios';
import '../styles/App.css';
import '../styles/InicioSection.css';

function Inicio() {
  const navigate = useNavigate();
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const [cargoUsuario, setCargoUsuario] = useState('');
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));
    if (!usuarioAutenticado) {
      navigate('/');
    } else {
      document.getElementById('username-display').textContent = usuarioAutenticado.username;
      setCargoUsuario(usuarioAutenticado.cargo); // Asegúrate de configurar el cargo del usuario
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
      console.error('Error al cargar inventario:', error);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await fetch('http://localhost:5003/api/productos');
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  };

  const cargarProveedores = async () => {
    try {
      const response = await fetch('http://localhost:5003/api/proveedores');
      if (!response.ok) throw new Error('Error al cargar los proveedores');
      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error('Error al cargar proveedores:', error);
    }
  };

  const cargarReportes = async () => {
    try {
      const response = await fetch('http://localhost:5003/api/reportes');
      if (!response.ok) throw new Error('Error al cargar los reportes');
      const data = await response.json();
      setReportes(data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    }
  };

  return (
    <div className="inventory">
      <Sidebar mostrarSeccion={mostrarSeccion} cerrarSesion={cerrarSesion} cargoUsuario={cargoUsuario} />
      <div id="content-section">
        {seccionActiva === 'inicio' && <InicioSection />}
        {seccionActiva === 'inventario' && <InventarioSection inventario={inventario} />}
        {seccionActiva === 'productos' && <ProductosSection productos={productos} />}
        {seccionActiva === 'proveedor' && <ProveedorSection proveedores={proveedores} cargoUsuario={cargoUsuario} />}
        {seccionActiva === 'reportes' && cargoUsuario === 'Administrador' && <ReportesSection reportes={reportes} />}
        {seccionActiva === 'compras' && <ComprasSection />}
        {seccionActiva === 'ventas' && <VentasSection />}
        {seccionActiva === 'usuarios' && cargoUsuario === 'Administrador' && <Usuarios />}
      </div>
    </div>
  );
}

export default Inicio;
