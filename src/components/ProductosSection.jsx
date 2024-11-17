import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ProductosSection.css'; // Importa los estilos

const ProductosSection = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '' });
  const [editando, setEditando] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  // Cargar productos desde el servidor
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    };

    fetchProductos();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto({ ...nuevoProducto, [name]: value });
  };
    
  // Agregar un nuevo producto
  const agregarProducto = async () => {
    try {
      if (!nuevoProducto.nombre || !nuevoProducto.precio) {
        alert('Por favor, llena todos los campos.');
        return;
      }

      const response = await axios.post('http://localhost:5003/api/productos', nuevoProducto);

      // Agregar el nuevo producto al estado actual
      setProductos([...productos, response.data]);

      // Limpiar el formulario
      setNuevoProducto({ nombre: '', precio: '' });

      alert('Producto agregado exitosamente.');
    } catch (error) {
      console.error('Error al agregar producto:', error);
      alert('Hubo un error al agregar el producto. Intenta de nuevo.');
    }
  };

  // Iniciar la edición de un producto
  const iniciarEdicion = (producto) => {
    setEditando(true);
    setProductoSeleccionado(producto);
    setNuevoProducto({ nombre: producto.nombre, precio: producto.precio });
  };

  // Guardar cambios en un producto existente
  const guardarEdicion = async () => {
    try {
      if (!nuevoProducto.nombre || !nuevoProducto.precio) {
        alert('Por favor, llena todos los campos.');
        return;
      }

      const response = await axios.put(
        `http://localhost:5003/api/productos/${productoSeleccionado.id}`,
        nuevoProducto
      );

      // Actualizar la lista de productos en el estado
      setProductos(productos.map((prod) =>
        prod.id === productoSeleccionado.id ? response.data : prod
      ));

      // Limpiar el estado y salir del modo de edición
      setEditando(false);
      setProductoSeleccionado(null);
      setNuevoProducto({ nombre: '', precio: '' });

      alert('Producto actualizado exitosamente.');
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      alert('Hubo un error al actualizar el producto. Intenta de nuevo.');
    }
  };

  // Eliminar un producto
  const eliminarProducto = async (id) => {
    try {
      await axios.delete(`http://localhost:5003/api/productos/${id}`);
      setProductos(productos.filter((producto) => producto.id !== id));
      alert('Producto eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Hubo un error al eliminar el producto. Intenta de nuevo.');
    }
  };

  return (
    <div className="section-container">
      <h1>Gestión de Productos</h1>

      <div className="formulario-producto">
        <input
          type="text"
          placeholder="Nombre del Producto"
          name="nombre"
          value={nuevoProducto.nombre}
          onChange={handleInputChange}
          className="input-producto"
        />
        <input
          type="number"
          placeholder="Precio"
          name="precio"
          value={nuevoProducto.precio}
          onChange={handleInputChange}
          className="input-producto"
        />
        {!editando ? (
          <button onClick={agregarProducto} className="btn-accion agregar">
            Agregar Producto
          </button>
        ) : (
          <>
            <button onClick={guardarEdicion} className="btn-accion actualizar">
              Guardar Cambios
            </button>
            <button onClick={() => {
                setEditando(false); // Sal del modo de edición
                setProductoSeleccionado(null); // Limpia el producto seleccionado
                setNuevoProducto({ nombre: '', precio: '' }); // Limpia los campos del formulario
              }}
              className="btn-accion cancelar"
            >
              Cancelar
            </button>
          </>
        )}
      </div>

      <table className="tabla-productos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>
                <button onClick={() => iniciarEdicion(producto)} className="btn-accion editar">
                  Editar
                </button>
                <button onClick={() => eliminarProducto(producto.id)} className="btn-accion eliminar">
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