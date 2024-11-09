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
  console.log('Recibida petición de login'); // Este mensaje debe aparecer cuando se haga la petición desde el frontend

  const { username, password } = req.body;
  console.log('Datos recibidos:', username, password); // Imprime los datos recibidos

  const query = 'SELECT * FROM usuario WHERE username = ? AND password = ?';
  loginDb.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err); // Mensaje en caso de error con la consulta SQL
      return res.status(500).send('Error en el servidor');
    }

    if (results.length > 0) {
      console.log('Usuario encontrado');
      res.json({ success: true, message: 'Inicio de sesión exitoso' });
    } else {
      console.log('Credenciales incorrectas');
      res.json({ success: false, message: 'Credenciales incorrectas' });
    }
  });
});

// Iniciar servidor en el puerto 500
app.listen(5002, () => {
  console.log('Servicio de Login corriendo en el puerto 5002');
});
