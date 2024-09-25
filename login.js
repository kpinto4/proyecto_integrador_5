// Login Functionality
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    // Validar usuario y contraseña
    if (username === 'felipe' && password === '1234') {
        // Redirigir a la página principal
        window.location.href = 'index.html';
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
});
