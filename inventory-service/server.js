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
app.put('/api/proveedores/:id', (req, res) => {
  const { id } = req.params; // Extrae el ID del proveedor desde la URL
  const { nombre, direccion, ciudad, telefono, correo_electronico, departamento, estado } = req.body;

  // Validación básica de campos obligatorios
  if (!nombre || !direccion || !ciudad || !telefono || !estado) {
    return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados.' });
  }

  // Consulta SQL para actualizar el proveedor
  const query = `
    UPDATE proveedor 
    SET nombre = ?, direccion = ?, ciudad = ?, telefono = ?, correo_electronico = ?, departamento = ?, estado = ? 
    WHERE id_proveedor = ?
  `;

  // Ejecución de la consulta
  inventoryDb.query(
    query,
    [nombre, direccion, ciudad, telefono, correo_electronico, departamento, estado, id],
    (err, results) => {
      if (err) {
        console.error('Error al actualizar proveedor:', err);
        return res.status(500).send(err); // Error interno del servidor
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Proveedor no encontrado.' }); // ID no existe en la base de datos
      }

      // Respuesta exitosa
      res.json({ id_proveedor: id, ...req.body });
    }
  );
});


// Eliminar un producto
app.delete('/api/proveedores/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM proveedor WHERE id_proveedor = ?';

  inventoryDb.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar proveedor:', err);
      return res.status(500).send(err);
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado.' });
    }
    res.json({ message: 'Proveedor eliminado correctamente.' });
  });
});

// Obtener todos los proveedores
app.get('/api/proveedores', (req, res) => {
  const query = 'SELECT * FROM proveedor';
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener proveedores:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Agregar un nuevo proveedor
app.post('/api/proveedores', (req, res) => {
  const { nombre, direccion, ciudad, telefono, correo_electronico, departamento, estado } = req.body;

  // Validación de campos obligatorios
  if (!nombre || !direccion || !ciudad || !telefono || !estado) {
    return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados.' });
  }

  const query = `INSERT INTO proveedor 
    (nombre, direccion, ciudad, telefono, correo_electronico, departamento, estado) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  inventoryDb.query(query, [nombre, direccion, ciudad, telefono, correo_electronico, departamento, estado], (err, results) => {
    if (err) {
      console.error('Error al agregar proveedor:', err);
      return res.status(500).send(err);
    }
    // Devuelve el proveedor recién agregado
    res.json({ id_proveedor: results.insertId, ...req.body });
  });
});

// Editar un proveedor existente
app.put('/api/proveedores/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, direccion, ciudad, telefono, correo_electronico, departamento, estado } = req.body;

  if (!nombre || !direccion || !ciudad || !telefono || !estado) {
    return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados.' });
  }

  const query = `UPDATE proveedor 
    SET nombre = ?, direccion = ?, ciudad = ?, telefono = ?, correo_electronico = ?, departamento = ?, estado = ? 
    WHERE id_proveedor = ?`;

  inventoryDb.query(query, [nombre, direccion, ciudad, telefono, correo_electronico, departamento, estado, id], (err, results) => {
    if (err) {
      console.error('Error al actualizar proveedor:', err);
      return res.status(500).send(err);
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado.' });
    }
    res.json({ id_proveedor: id, ...req.body });
  });
});

// Eliminar un proveedor
app.delete('/api/proveedores/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM proveedor WHERE id_proveedor = ?';
  inventoryDb.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar proveedor:', err);
      return res.status(500).send(err);
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado.' });
    }
    res.json({ message: 'Proveedor eliminado correctamente', id_proveedor: id });
  });
});

// Escucha en el puerto 5003
app.listen(5003, () => {
  console.log('Servicio de Inventario corriendo en el puerto 5003');
});
