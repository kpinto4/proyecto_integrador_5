const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos de inventario
const inventoryDb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RIOLkelu01.', // Cambia por tu contraseña
  database: 'proyecto_5', // Cambia por el nombre de la base de datos del inventario
  port: 3306
});

inventoryDb.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos de inventario: ', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos de inventario');
});

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
  const query = 'SELECT cod_producto AS id, nombre, precio FROM producto';
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Insertar un nuevo producto
app.post('/api/productos', (req, res) => {
  const { nombre, precio } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ message: 'El nombre y el precio son obligatorios.' });
  }

  const query = 'INSERT INTO producto (nombre, precio) VALUES (?, ?)';
  inventoryDb.query(query, [nombre, precio], (err, results) => {
    if (err) {
      console.error('Error al insertar producto:', err);
      return res.status(500).send(err);
    }

    res.json({ id: results.insertId, nombre, precio });
  });
});

// Actualizar un producto existente
app.put('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;

  if (!nombre || !precio) {
    return res.status(400).json({ message: 'El nombre y el precio son obligatorios.' });
  }

  const query = 'UPDATE producto SET nombre = ?, precio = ? WHERE cod_producto = ?';
  inventoryDb.query(query, [nombre, precio, id], (err, results) => {
    if (err) {
      console.error('Error al actualizar producto:', err);
      return res.status(500).send(err);
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado.' });
    }

    res.json({ id, nombre, precio });
  });
});

// Eliminar un producto
app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM producto WHERE cod_producto = ?';
  inventoryDb.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar producto:', err);
      return res.status(500).send(err);
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente', id });
  });
});

// Rutas de gestión de proveedores
app.get('/api/proveedores', (req, res) => {
  const query = 'SELECT * FROM proveedor';
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta de proveedor:', err);
      return res.status(500).send(err);
    }
    console.log('Resultados:', results);
    res.json(results);
  });
});

// Escucha en el puerto 5003
app.listen(5003, () => {
  console.log('Servicio de Inventario corriendo en el puerto 5003');
});
