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
  const query = 'SELECT cod_producto AS id, nombre, precio FROM producto;';
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener productos:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

const desactivarStockCero = () => {
  const query = 'UPDATE inventario SET activo = FALSE WHERE stock = 0';
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al desactivar registros con stock 0:', err);
    } else {
      console.log(`Se desactivaron ${results.affectedRows} registros con stock 0.`);
    }
  });
};

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

//Obtener Datos de Inventario
app.get('/api/inventario', (req, res) => {
  const query = 'SELECT i.id_inventario, p.nombre AS producto, i.lote, i.stock, i.fechaingreso FROM inventario i JOIN producto p ON i.producto = p.cod_producto WHERE i.stock > 0;';
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el inventario:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});


app.put('/api/inventario/actualizar', (req, res) => {
  const { id_inventario, nuevo_stock } = req.body;

  const queryActualizarStock = 'UPDATE inventario SET stock = ? WHERE id_inventario = ?;';

  inventoryDb.query(queryActualizarStock, [nuevo_stock, id_inventario], (err, results) => {
    if (err) {
      console.error('Error al actualizar stock:', err);
      return res.status(500).send(err);
    }

    if (results.affectedRows > 0) {
      // Verificar si hay lotes con stock = 0 y eliminarlos
      const queryEliminarLotes = 'DELETE FROM inventario WHERE stock = 0;';
      inventoryDb.query(queryEliminarLotes, (err, deleteResults) => {
        if (err) {
          console.error('Error al eliminar lotes con stock 0:', err);
          return res.status(500).send(err);
        }

        console.log(`Lotes eliminados: ${deleteResults.affectedRows}`);
        res.json({ message: 'Stock actualizado y lotes con stock 0 eliminados.' });
      });
    } else {
      res.status(404).json({ message: 'No se encontró el inventario para actualizar.' });
    }
  });
});

// Registrar Venta
app.post('/api/ventas', (req, res) => {
  const { cod_producto, cantidad } = req.body;

  if (!cod_producto || !cantidad) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  // Seleccionar el lote más antiguo con stock suficiente
  const selectQuery = 'SELECT id_inventario, stock FROM inventario WHERE producto = ? AND stock > 0 ORDER BY fechaingreso ASC LIMIT 1;';
  inventoryDb.query(selectQuery, [cod_producto], (err, results) => {
    if (err) {
      console.error('Error al seleccionar lote:', err);
      return res.status(500).send(err);
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'No hay stock suficiente para este producto.' });
    }

    const { id_inventario, stock } = results[0];

    if (stock < cantidad) {
      return res.status(400).json({ message: 'Stock insuficiente en el lote seleccionado.' });
    }

    // Actualizar el stock del lote seleccionado
    const updateQuery = 'UPDATE inventario SET stock = stock - ? WHERE id_inventario = ?;';
    inventoryDb.query(updateQuery, [cantidad, id_inventario], (updateErr) => {
      if (updateErr) {
        console.error('Error al actualizar el stock:', updateErr);
        return res.status(500).send(updateErr);
      }

      // Registrar la venta
      const insertVentaQuery = 'INSERT INTO venta (cod_producto, cantidad, valor, fecha) SELECT ?, ?, precio * ?, NOW() FROM producto WHERE cod_producto = ?;';
      inventoryDb.query(insertVentaQuery, [cod_producto, cantidad, cantidad, cod_producto], (insertErr, result) => {
        if (insertErr) {
          console.error('Error al registrar la venta:', insertErr);
          return res.status(500).send(insertErr);
        }

        res.json({ message: 'Venta registrada exitosamente.', id_venta: result.insertId });
      });
    });
  });
});

//Obtener Historial de Ventas
app.get('/api/ventas', (req, res) => {
  const query = 'SELECT v.id_venta, p.nombre AS producto, v.cantidad, (v.cantidad * p.precio) AS total_venta, v.fecha FROM venta v INNER JOIN producto p ON v.cod_producto = p.cod_producto ORDER BY v.fecha DESC;';
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el historial de ventas:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

//Consultar Compras
app.get('/api/compras', (req, res) => {
  const query = 'SELECT c.id_compra,p.nombre AS producto,pr.nombre AS proveedor,c.cantidad,c.fecha,c.total FROM compra c INNER JOIN producto p ON c.cod_producto = p.cod_producto INNER JOIN proveedor pr ON c.id_proveedor = pr.id_proveedor ORDER BY c.fecha DESC;';
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener el historial de compras:', err);
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.post('/api/compras', (req, res) => {
  const { cod_producto, cantidad, precio_unitario, id_proveedor } = req.body;

  if (!cod_producto || !cantidad || !precio_unitario || !id_proveedor) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  // Consulta para insertar la compra
  const insertCompraQuery = 'INSERT INTO compra (cod_producto, id_proveedor, cantidad, fecha, total) VALUES (?, ?, ?, NOW(), ?);';
  // Consulta para insertar en inventario
  const insertInventarioQuery = 'INSERT INTO inventario (producto, lote, stock, fechaingreso) VALUES (?, ?, ?, NOW());';
  inventoryDb.query(
    insertCompraQuery,
    [cod_producto, id_proveedor, cantidad, precio_unitario],
    (err, result) => {
      if (err) {
        console.error('Error al registrar la compra:', err);
        return res.status(500).send(err);
      }

      // Insertar en inventario
      inventoryDb.query(
        insertInventarioQuery,
        [cod_producto, result.insertId, cantidad],
        (inventoryErr) => {
          if (inventoryErr) {
            console.error('Error al actualizar el inventario:', inventoryErr);
            return res.status(500).send(inventoryErr);
          }

          res.status(201).json({
            id_compra: result.insertId,
            cod_producto,
            id_proveedor,
            cantidad,
            fecha: new Date(),
            total: precio_unitario,
          });
        }
      );
    }
  );
});

app.get('/api/alertas', (req, res) => {
  const query = 'SELECT p.nombre AS producto, i.stock, i.fechaingreso, DATEDIFF(NOW(), i.fechaingreso) AS dias_desde_ingreso FROM inventario i JOIN producto p ON i.producto = p.cod_producto WHERE i.stock > 0 AND (i.stock <= 3 OR DATEDIFF(NOW(), i.fechaingreso) >= 5);';
  console.log('Ejecutando consulta:', query); // DEPURACIÓN
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener alertas:', err); // Muestra más detalles del error
      res.status(500).send(err);
    } else {
      console.log('Resultados obtenidos:', results); // Verifica los resultados obtenidos
      res.json(results);
    }
  });
});

app.get('/api/reportes/ventas', (req, res) => {
  const query = 'SELECT p.nombre AS producto, SUM(v.cantidad) AS cantidad_vendida, MAX(v.fecha) AS ultima_venta FROM venta v JOIN producto p ON v.cod_producto = p.cod_producto WHERE v.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY p.cod_producto ORDER BY cantidad_vendida DESC LIMIT 1';
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener reporte de ventas:', err);
      return res.status(500).json({ message: 'Error al obtener reporte de ventas.' });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.json({ message: 'No hay datos para el reporte semanal de ventas.' });
    }
  });
});

app.get('/api/reportes/compras', (req, res) => {
  const query = 'SELECT p.nombre AS producto, SUM(c.cantidad) AS cantidad_comprada, MAX(c.fecha) AS ultima_compra FROM compra c JOIN producto p ON c.cod_producto = p.cod_producto WHERE c.fecha >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY p.cod_producto ORDER BY cantidad_comprada DESC LIMIT 1;';
  inventoryDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener reporte de compras:', err);
      return res.status(500).json({ message: 'Error al obtener reporte de compras.' });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.json({ message: 'No hay datos para el reporte semanal de compras.' });
    }
  });
});

app.get('/api/reportes/financiero', async (req, res) => {
  try {
    // Consulta para obtener el total de ventas
    inventoryDb.query('SELECT SUM(valor) AS total_ventas FROM venta;', (err, ventasResult) => {
      if (err) {
        console.error('Error en consulta de ventas:', err);
        res.status(500).json({ message: 'Error al obtener el reporte financiero (ventas).' });
        return;
      }
      const totalVentas = ventasResult[0]?.total_ventas || 0;

      // Consulta para obtener el total de compras
      inventoryDb.query('SELECT SUM(total) AS total_compras FROM compra;', (err, comprasResult) => {
        if (err) {
          console.error('Error en consulta de compras:', err);
          res.status(500).json({ message: 'Error al obtener el reporte financiero (compras).' });
          return;
        }
        const totalCompras = comprasResult[0]?.total_compras || 0;

        // Calcular las ganancias
        const ganancias = totalVentas - totalCompras;

        // Responder con los datos
        res.json({
          total_ventas: totalVentas,
          total_compras: totalCompras,
          ganancias,
        });
      });
    });
  } catch (error) {
    console.error('Error general al obtener el reporte financiero:', error);
    res.status(500).json({ message: 'Error general al obtener el reporte financiero.' });
  }
});

// Escucha en el puerto 5003
app.listen(5003, () => {
  console.log('Servicio de Login corriendo en el puerto 5003');
});