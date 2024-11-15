import React, { useState, useEffect } from 'react';
import '../styles/ProductosSection.css';

const ProductosSection = () => {
  // Estado para manejar la lista de productos y los campos del formulario
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [valorUnitario, setValorUnitario] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editProducto, setEditProducto] = useState(null);

  // Obtener productos del backend al cargar el componente
  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para obtener productos desde el backend
  const fetchProductos = () => {
    fetch('http://localhost:5003/api/productos') // Asegúrate de que esta URL es la correcta
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error('Error al obtener productos:', error));
  };

  // Función para agregar un nuevo producto
  const agregarProducto = () => {
    if (nombre && valorUnitario) {
      const nuevoProducto = {
        nombre,
        valor_unitario: parseFloat(valorUnitario),
      };

      fetch('http://localhost:5003/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert('Producto agregado exitosamente');
            fetchProductos(); // Actualizar la lista de productos
            limpiarFormulario();
          } else {
            alert('Error al agregar producto');
          }
        })
        .catch((error) => console.error('Error al agregar producto:', error));
    }
  };

  // Función para actualizar un producto existente
  const actualizarProducto = () => {
    if (editProducto && nombre && valorUnitario) {
      const productoActualizado = {
        nombre,
        valor_unitario: parseFloat(valorUnitario),
      };

      fetch(`http://localhost:5003/api/productos/${editProducto.cod_producto}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoActualizado),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert('Producto actualizado exitosamente');
            fetchProductos(); // Actualizar la lista de productos
            limpiarFormulario();
          } else {
            alert('Error al actualizar producto');
          }
        })
        .catch((error) => console.error('Error al actualizar producto:', error));
    }
  };

  // Función para eliminar un producto
  const eliminarProducto = (productoId) => {
    fetch(`http://localhost:5003/api/productos/${productoId}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Producto eliminado exitosamente');
          fetchProductos(); // Actualizar la lista de productos
        } else {
          alert('Error al eliminar producto');
        }
      })
      .catch((error) => console.error('Error al eliminar producto:', error));
  };

  // Función para limpiar el formulario
  const limpiarFormulario = () => {
    setNombre('');
    setValorUnitario('');
    setEditIndex(null);
    setEditProducto(null);
  };

  // Función para cargar los datos de un producto en el formulario para editar
  const editarProducto = (producto) => {
    setEditProducto(producto);
    setNombre(producto.nombre);
    setValorUnitario(producto.valor_unitario);
    setEditIndex(producto.id);
  };

  return (
    <div className="section-container productos-section">
      <h2>Gestión de Productos</h2>

      {/* Formulario para agregar o actualizar productos */}
      <div className="formulario-producto">
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input-producto"
        />
        <input
          type="number"
          placeholder="Valor Unitario"
          value={valorUnitario}
          onChange={(e) => setValorUnitario(e.target.value)}
          className="input-producto"
        />
        {editIndex !== null ? (
          <button onClick={actualizarProducto} className="btn-accion actualizar">
            Actualizar
          </button>
        ) : (
          <button onClick={agregarProducto} className="btn-accion agregar">
            Agregar Producto
          </button>
        )}
        <button onClick={limpiarFormulario} className="btn-accion cancelar">
          Cancelar
        </button>
      </div>

      {/* Tabla de productos */}
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Valor Unitario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.cod_producto}>
              <td>{producto.cod_producto}</td>
              <td>{producto.nombre}</td>
              <td>{producto.valor_unitario}</td>
              <td>
                <button onClick={() => editarProducto(producto)} className="btn-accion editar">
                  Editar
                </button>
                <button
                  onClick={() => eliminarProducto(producto.cod_producto)}
                  className="btn-accion eliminar"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductosSection;
