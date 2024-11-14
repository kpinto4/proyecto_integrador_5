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

// Ruta para obtener productos
app.get('/api/productos', (req, res) => {
  const query = 'SELECT * FROM producto'; // Cambia si tu tabla tiene otro nombre
  inventoryDb.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Ruta para obtener todos los proveedores
app.get('/api/proveedores', (req, res) => {
  const query = 'SELECT * FROM proveedor';
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error en la consulta de proveedor:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Ruta para agregar un nuevo proveedor
app.post('/api/proveedores', (req, res) => {
  const { nombre, direccion, ciudad, telefono, estado, correo_electronico = '', departamento = '' } = req.body;
  console.log('Datos recibidos en el backend:', req.body);
  const query = 'INSERT INTO proveedor (nombre, direccion, ciudad, telefono, estado, correo_electronico, departamento) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
  inventoryDb.query(query, [nombre, direccion, ciudad, telefono, estado, correo_electronico, departamento], (err, result) => {
    if (err) {
      console.error('Error al agregar proveedor:', err);
      return res.status(500).send(err);
    }
    res.json({ success: true, message: 'Proveedor agregado exitosamente' });
  });
});

// Ruta para actualizar un proveedor
app.put('/api/proveedores/:id_proveedor', (req, res) => {
  const { id_proveedor } = req.params;
  const { nombre, direccion, ciudad, telefono, estado } = req.body;
  const query = 'UPDATE proveedor SET nombre = ?, direccion = ?, ciudad = ?, telefono = ?, estado = ? WHERE id_proveedor = ?';
  inventoryDb.query(query, [nombre, direccion, ciudad, telefono, estado, id_proveedor], (err, result) => {
    if (err) {
      console.error('Error al actualizar proveedor:', err);
      return res.status(500).send(err);
    }
    res.json({ success: true, message: 'Proveedor actualizado exitosamente' });
  });
});

// Ruta para eliminar un proveedor
app.delete('/api/proveedores/:id_proveedor', (req, res) => {
  const { id_proveedor } = req.params;
  const query = 'DELETE FROM proveedor WHERE id_proveedor = ?';
  inventoryDb.query(query, [id_proveedor], (err, result) => {
    if (err) {
      console.error('Error al eliminar proveedor:', err);
      return res.status(500).send(err);
    }
    res.json({ success: true, message: 'Proveedor eliminado exitosamente' });
  });
});

// Escucha en el puerto 5003
app.listen(5003, () => {
  console.log('Servicio de Inventario corriendo en el puerto 5003');
});
