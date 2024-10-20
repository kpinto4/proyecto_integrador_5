// Función para cargar los usuarios desde el archivo usuarios.json
async function cargarUsuariosDesdeJSON() {
    try {
        const respuesta = await fetch('usuarios.json'); // Asegúrate de que la ruta sea correcta
        if (!respuesta.ok) {
            throw new Error('Error al cargar el archivo JSON de usuarios');
        }
        const usuarios = await respuesta.json();
        return usuarios;
    } catch (error) {
        console.error('Error al cargar los usuarios:', error);
        return [];
    }
}

// Función para manejar el inicio de sesión
async function iniciarSesion(event) {
    event.preventDefault(); // Evita que el formulario se recargue

    const username = document.getElementById('username').value.trim().toLowerCase();
    const password = document.getElementById('password').value.trim();

    // Cargar los usuarios desde usuarios.json
    const usuarios = await cargarUsuariosDesdeJSON();

    // Verificar si las credenciales del usuario coinciden
    const usuario = usuarios.find(u => u.username.toLowerCase() === username && u.password === password);

    if (usuario) {
        // Guardar el estado de autenticación en LocalStorage
        localStorage.setItem('usuarioAutenticado', JSON.stringify(usuario));

        // Redirigir al inventario después de iniciar sesión
        window.location.href = 'inventory.html';
    } else {
        // Mostrar mensaje de error si las credenciales no son válidas
        document.getElementById('error-message').textContent = 'Usuario o contraseña incorrectos';
    }
}

// Asignar la función de inicio de sesión al formulario cuando la página cargue
window.onload = function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Si estamos en login.html, manejar el evento de envío del formulario
        loginForm.addEventListener('submit', iniciarSesion);
    }
};
