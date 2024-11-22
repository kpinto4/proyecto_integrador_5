const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos de Login
const loginDb = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'RIOLkelu01.', // Verifica tu contraseña
  database: 'usuarios', // Verifica el nombre de tu base de datos
  port: 3306
});

loginDb.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos de login: ', err); // Aquí se verá el error si falla la conexión
    return;
  }
  console.log('Conexión exitosa a la base de datos de login');
});

// Ruta para el login
app.post('/api/login', (req, res) => {
  console.log('Recibida petición de login');

  const { username, password } = req.body;
  console.log('Datos recibidos:', username, password);

  const query = 'SELECT cargo FROM usuario WHERE username = ? AND password = ?';
  loginDb.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err);
      return res.status(500).send('Error en el servidor');
    }

    if (results.length > 0) {
      console.log('Usuario encontrado:', results[0].cargo);
      res.json({ 
        success: true, 
        message: 'Inicio de sesión exitoso',
        cargo: results[0].cargo // Incluye el cargo en la respuesta
      });
    } else {
      console.log('Credenciales incorrectas');
      res.json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
});

// Ruta para obtener todos los usuarios
app.get('/api/usuarios', (req, res) => {
  const query = 'SELECT id, username, password, nombre, apellido, cargo FROM usuario;';
  loginDb.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.json(results);
    }
  });
});

// Ruta para crear un nuevo usuario
app.post('/api/usuarios', (req, res) => {
  const { nombre, apellido, username, password, cargo } = req.body;
  const query = 'INSERT INTO usuario (nombre, apellido, username, password, cargo) VALUES (?, ?, ?, ?, ?)';
  loginDb.query(query, [nombre, apellido, username, password, cargo], (err, results) => {
    if (err) {
      console.error('Error al crear usuario:', err);
      res.status(500).send('Error al crear usuario');
    } else {
      res.status(201).send('Usuario creado exitosamente');
    }
  });
});

// Ruta para editar un usuario existente
app.put('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, username, password, cargo } = req.body;
  const query = 'UPDATE usuario SET nombre = ?, apellido = ?, username = ?, password = ?, cargo = ? WHERE id = ?';
  const values = [nombre, apellido, username, password, cargo, id];
  loginDb.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al actualizar el usuario:', err);
      res.status(500).send('Error al actualizar el usuario');
    } else {
      res.send({ message: 'Usuario actualizado correctamente' });
    }
  });
});


// Ruta para eliminar un usuario
app.delete('/api/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM usuario WHERE id = ?';
  loginDb.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al eliminar usuario:', err);
      res.status(500).send('Error al eliminar usuario');
    } else {
      res.send('Usuario eliminado exitosamente');
    }
  });
});

// Iniciar servidor en el puerto 500
app.listen(5002, () => {
  console.log('Servicio de Login corriendo en el puerto 5002');
});
