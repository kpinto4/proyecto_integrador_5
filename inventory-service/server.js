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
    res.json({ message: 'Producto eliminado correctamente', cod_producto: id });
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

  if (!nombre || !direccion || !ciudad || !telefono || !estado) {
    return res.status(400).json({ message: 'Todos los campos obligatorios deben ser completados.' });
  }

  const query = 'INSERT INTO proveedor (nombre, direccion, ciudad, telefono, correo_electronico, departamento, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
  inventoryDb.query(query, [nombre, direccion, ciudad, telefono, correo_electronico, departamento, estado], (err, results) => {
    if (err) {
      console.error('Error al agregar proveedor:', err);
      return res.status(500).send(err);
    }
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

  const query = 'UPDATE proveedor SET nombre = ?, direccion = ?, ciudad = ?, telefono = ?, correo_electronico = ?, departamento = ?, estado = ? WHERE id_proveedor = ? ';
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

// Obtener todos los productos con datos de inventario
app.get('/api/inventario', (req, res) => {
  const query = 'SELECT * FROM producto'; // Ajusta la consulta según lo necesario
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener datos del inventario:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post('/api/ventas', (req, res) => {
  const { id_producto, cantidad } = req.body;

  if (!id_producto || !cantidad || cantidad <= 0) {
    return res.status(400).json({ message: 'Datos inválidos para registrar la venta.' });
  }

  // Registrar la venta con la columna correcta 'cod_producto'
  const queryVenta = 'INSERT INTO venta (cod_producto, cantidad, valor, fecha) SELECT ?, ?, precio * ?, NOW() FROM producto WHERE cod_producto = ?; ';

  inventoryDb.query(queryVenta, [id_producto, cantidad, cantidad, id_producto], (err, results) => {
    if (err) {
      console.error('Error al registrar la venta:', err);
      return res.status(500).send(err);
    }

    // Actualizar el stock del producto
    const queryStock = 'UPDATE producto SET stock = stock - ? WHERE cod_producto = ? AND stock >= ?; ';

    inventoryDb.query(queryStock, [cantidad, id_producto, cantidad], (err, result) => {
      if (err) {
        console.error('Error al actualizar el stock:', err);
        return res.status(500).send(err);
      }

      if (result.affectedRows === 0) {
        return res.status(400).json({ message: 'Stock insuficiente para realizar la venta.' });
      }

      res.status(201).json({ message: 'Venta registrada y stock actualizado correctamente.' });
    });
  });
});

//Obtener Historial de Ventas
app.get('/api/ventas', (req, res) => {
  const query = 'SELECT v.id_venta, p.nombre AS producto, v.cantidad, v.valor, DATE(v.fecha) AS fecha FROM venta v INNER JOIN producto p ON v.cod_producto = p.cod_producto ORDER BY v.fecha DESC; ';

  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el historial de ventas:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Escucha en el puerto 5003
app.listen(5003, () => {
  console.log('Servicio de Inventario corriendo en el puerto 5003');
});