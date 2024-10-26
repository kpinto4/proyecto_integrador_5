// URL base del servidor JSON
const BASE_URL = 'http://localhost:3000';

// Función para cargar datos desde la API de json-server
async function cargarDatosDesdeAPI(seccion) {
    try {
        const response = await fetch(`${BASE_URL}/${seccion}`);
        if (!response.ok) {
            throw new Error(`Error al cargar ${seccion}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return [];
    }
}

// Función para enviar datos a la API (CRUD)
async function enviarDatosAPI(endpoint, metodo, data) {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}`, {
            method: metodo,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`Error en la operación con ${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error('Error en enviarDatosAPI:', error);
    }
}

// Función para verificar si el usuario está autenticado
function verificarAutenticacion() {
    const usuarioAutenticado = JSON.parse(localStorage.getItem('usuarioAutenticado'));
    if (!usuarioAutenticado) {
        window.location.href = 'login.html';
    } else {
        document.getElementById('username-display').textContent = usuarioAutenticado.username;
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioAutenticado');
    window.location.href = 'login.html';
}

// Función para generar un número de lote automático
function generarNumeroDeLote() {
    const fecha = new Date();
    return 'L' + fecha.getFullYear().toString().slice(-2) +
        ('0' + (fecha.getMonth() + 1)).slice(-2) +
        ('0' + fecha.getDate()).slice(-2) +
        '-' + Math.floor(1000 + Math.random() * 9000);
}

// Función para registrar una compra y actualizar el inventario
async function registrarCompra(event) {
    event.preventDefault();

    const productoNombre = document.getElementById('purchase-product-name').value;
    const cantidadComprada = parseInt(document.getElementById('purchase-quantity').value, 10);
    const precioUnitario = parseFloat(document.getElementById('purchase-price').value);
    const fechaCompra = new Date().toISOString().split('T')[0];
    const proveedorSeleccionado = document.getElementById('purchase-provider').value;
    const lote = generarNumeroDeLote();

    const nuevaCompra = {
        producto: productoNombre,
        lote: lote,
        precio: precioUnitario,
        cantidad: cantidadComprada,
        proveedor: proveedorSeleccionado,
        fecha: fechaCompra
    };

    await enviarDatosAPI('compras', 'POST', nuevaCompra);

    const productos = await cargarDatosDesdeAPI('productos');
    const productoExistente = productos.find(p => p.nombre === productoNombre);

    if (productoExistente) {
        productoExistente.stock += cantidadComprada;
        await enviarDatosAPI(`productos/${productoExistente.id}`, 'PUT', productoExistente);
    } else {
        const nuevoProducto = {
            nombre: productoNombre,
            lote: lote,
            precio: precioUnitario,
            stock: cantidadComprada,
            fechaIngreso: fechaCompra
        };
        await enviarDatosAPI('productos', 'POST', nuevoProducto);
    }

    consultarInventario();
    consultarCompras();
    alert(`Compra registrada con éxito. Lote asignado: ${lote}`);
}

// Función para registrar una venta y actualizar el inventario
async function registrarVenta(event) {
    event.preventDefault();

    const productoId = parseInt(document.getElementById('sales-product-id').value, 10);
    const cantidadVendida = parseInt(document.getElementById('sales-quantity').value, 10);
    const fecha = new Date().toISOString().split('T')[0];

    if (isNaN(productoId) || isNaN(cantidadVendida) || cantidadVendida <= 0) {
        alert("Por favor, ingresa datos válidos para el ID del producto y la cantidad.");
        return;
    }

    const productos = await cargarDatosDesdeAPI('productos');
    const producto = productos.find(p => p.id === productoId);

    if (!producto) {
        alert('Producto no encontrado.');
        return;
    }

    if (producto.stock < cantidadVendida) {
        alert('Stock insuficiente para realizar la venta.');
        return;
    }

    const totalVenta = producto.precio * cantidadVendida;
    const nuevaVenta = {
        producto: producto.nombre,
        cantidad: cantidadVendida,
        fecha: fecha,
        total: totalVenta
    };

    producto.stock -= cantidadVendida;
    await enviarDatosAPI('ventas', 'POST', nuevaVenta);
    await enviarDatosAPI(`productos/${producto.id}`, 'PUT', producto);

    alert('Venta registrada con éxito');
    consultarVentas();
    consultarInventario();
}

// Función para registrar un proveedor y actualizar la tabla de proveedores
async function registrarProveedor(event) {
    event.preventDefault();

    const nombre = document.getElementById('supplier-name').value;
    const direccion = document.getElementById('supplier-address').value;
    const ciudad = document.getElementById('supplier-city').value;
    const telefono = document.getElementById('supplier-phone').value;
    const estado = document.getElementById('supplier-status').value;

    if (!nombre || !direccion || !ciudad || !telefono || !estado) {
        alert("Por favor completa todos los campos");
        return;
    }

    const nuevoProveedor = { nombre, direccion, ciudad, telefono, estado };

    const proveedores = await cargarDatosDesdeAPI('proveedores');
    const proveedorExistente = proveedores.find(p => p.nombre === nombre);
    if (proveedorExistente) {
        alert('Ya existe un proveedor con ese nombre');
        return;
    }

    await enviarDatosAPI('proveedores', 'POST', nuevoProveedor);

    consultarProveedores();
    alert('Proveedor registrado con éxito');

    document.getElementById('supplier-form').reset();
}

// Función para registrar o editar un producto
async function guardarCambiosProducto(event) {
    event.preventDefault();

    const productoId = document.getElementById('product-select').value;
    const nuevoNombre = document.getElementById('product-name').value;
    const nuevoPrecio = parseFloat(document.getElementById('product-price').value);

    if (!productoId || !nuevoNombre || isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
        alert("Por favor, completa todos los campos correctamente.");
        return;
    }

    const productoActualizado = {
        nombre: nuevoNombre,
        precio: nuevoPrecio
    };

    await enviarDatosAPI(`productos/${productoId}`, 'PUT', productoActualizado);

    alert("Producto actualizado con éxito.");
    consultarInventario(); // Actualizar lista de inventario
    cargarProductosEnFormulario(); // Actualizar formulario de productos
}

// Cargar lista de productos en el formulario para seleccionar y editar
async function cargarProductosEnFormulario() {
    const productos = await cargarDatosDesdeAPI('productos');
    const productSelect = document.getElementById('product-select');
    productSelect.innerHTML = '<option value="">Selecciona un Producto</option>';

    productos.forEach(producto => {
        const option = document.createElement('option');
        option.value = producto.id;
        option.textContent = producto.nombre;
        productSelect.appendChild(option);
    });
}

// Mostrar detalles del producto seleccionado en el formulario de edición
async function mostrarProductoParaEditar(event) {
    const productoId = event.target.value;
    if (!productoId) return;

    const producto = await cargarDatosDesdeAPI(`productos/${productoId}`);
    document.getElementById('product-name').value = producto.nombre;
    document.getElementById('product-price').value = producto.precio;
}

// Función para consultar y mostrar el inventario en la tabla
async function consultarInventario() {
    const productos = await cargarDatosDesdeAPI('productos');
    let tablaInventario = '';

    productos.forEach(producto => {
        tablaInventario += `<tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.lote}</td>
            <td>${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>${producto.fechaIngreso}</td>
        </tr>`;
    });

    document.getElementById('inventory-list').innerHTML = tablaInventario;
}

// Función para consultar y mostrar las compras en la tabla de compras
async function consultarCompras() {
    const compras = await cargarDatosDesdeAPI('compras');
    let tablaCompras = '';

    compras.forEach(compra => {
        tablaCompras += `<tr>
            <td>${compra.id}</td>
            <td>${compra.producto}</td>
            <td>${compra.cantidad}</td>
            <td>${compra.proveedor}</td>
            <td>${compra.fecha}</td>
            <td>${compra.lote}</td>
        </tr>`;
    });

    document.getElementById('purchase-list').innerHTML = tablaCompras;
}

// Función para consultar y mostrar las ventas en la tabla de ventas
async function consultarVentas() {
    const ventas = await cargarDatosDesdeAPI('ventas');
    let tablaVentas = '';

    ventas.forEach(venta => {
        tablaVentas += `<tr>
            <td>${venta.id}</td>
            <td>${venta.producto}</td>
            <td>${venta.cantidad}</td>
            <td>${venta.fecha}</td>
            <td>${venta.total}</td>
        </tr>`;
    });

    document.getElementById('sales-list').innerHTML = tablaVentas;
}

// Función para consultar y mostrar los reportes de compras y ventas
async function consultarReportes() {
    const compras = await cargarDatosDesdeAPI('compras');
    const ventas = await cargarDatosDesdeAPI('ventas');

    let tablaReportesCompras = '';
    compras.forEach(compra => {
        const totalCompra = compra.cantidad * compra.precio;
        tablaReportesCompras += `<tr>
            <td>${compra.id}</td>
            <td>${compra.producto}</td>
            <td>${compra.cantidad}</td>
            <td>${compra.proveedor}</td>
            <td>${compra.fecha}</td>
            <td>${totalCompra.toFixed(2)}</td>
        </tr>`;
    });
    document.getElementById('report-compras-list').innerHTML = tablaReportesCompras;

    let tablaReportesVentas = '';
    ventas.forEach(venta => {
        tablaReportesVentas += `<tr>
            <td>${venta.id}</td>
            <td>${venta.producto}</td>
            <td>${venta.cantidad}</td>
            <td>${venta.fecha}</td>
            <td>${venta.total.toFixed(2)}</td>
        </tr>`;
    });
    document.getElementById('report-ventas-list').innerHTML = tablaReportesVentas;
}

// Función para consultar y mostrar los proveedores en la tabla de proveedores
async function consultarProveedores() {
    const proveedores = await cargarDatosDesdeAPI('proveedores');
    let tablaProveedores = '';

    proveedores.forEach(proveedor => {
        tablaProveedores += `<tr>
            <td>${proveedor.id}</td>
            <td>${proveedor.nombre}</td>
            <td>${proveedor.direccion}</td>
            <td>${proveedor.ciudad}</td>
            <td>${proveedor.telefono}</td>
            <td>${proveedor.estado}</td>
        </tr>`;
    });

    document.getElementById('supplier-list').innerHTML = tablaProveedores;

    const proveedorSelect = document.getElementById('purchase-provider');
    proveedorSelect.innerHTML = '<option value="">Seleccione un Proveedor</option>';
    proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor.nombre;
        option.textContent = proveedor.nombre;
        proveedorSelect.appendChild(option);
    });
}

// Función para mostrar las notificaciones
async function mostrarNotificaciones() {
    const productos = await cargarDatosDesdeAPI('productos');
    const notificacionesList = document.getElementById('notificaciones-list');
    notificacionesList.innerHTML = '';

    productos.forEach(producto => {
        const fechaIngreso = new Date(producto.fechaIngreso);
        const fechaActual = new Date();
        const diferenciaDias = Math.floor((fechaActual - fechaIngreso) / (1000 * 60 * 60 * 24));

        if (diferenciaDias >= 6) {
            const notificacion = document.createElement('li');
            notificacion.textContent = `El producto "${producto.nombre}" está a punto de caducar.`;
            const marcarRealizada = document.createElement('button');
            marcarRealizada.textContent = 'Marcar como realizada';
            marcarRealizada.addEventListener('click', () => {
                notificacionesList.removeChild(notificacion);
            });
            notificacion.appendChild(marcarRealizada);
            notificacionesList.appendChild(notificacion);
        }

        if (producto.stock < 10) {
            const notificacionBajoStock = document.createElement('li');
            notificacionBajoStock.textContent = `El producto "${producto.nombre}" tiene un stock bajo (${producto.stock} unidades).`;
            const marcarRealizada = document.createElement('button');
            marcarRealizada.textContent = 'Marcar como realizada';
            marcarRealizada.addEventListener('click', () => {
                notificacionesList.removeChild(notificacionBajoStock);
            });
            notificacionBajoStock.appendChild(marcarRealizada);
            notificacionesList.appendChild(notificacionBajoStock);
        }
    });
}

// Función para mostrar una sección y ocultar las demás
function mostrarSeccion(seccionId) {
    const secciones = document.querySelectorAll('.table-section');
    secciones.forEach(seccion => seccion.style.display = 'none');
    const seccionMostrada = document.getElementById(seccionId);
    if (seccionMostrada) {
        seccionMostrada.style.display = 'block';
    }
}

// Función para inicializar la navegación entre las secciones
function inicializarNavegacion() {
    document.getElementById('inicio-btn').addEventListener('click', () => mostrarSeccion('inicio-section'));
    document.getElementById('inventario-btn').addEventListener('click', () => mostrarSeccion('inventario-section'));
    document.getElementById('purchase-btn').addEventListener('click', () => mostrarSeccion('purchase-section'));
    document.getElementById('sales-btn').addEventListener('click', () => mostrarSeccion('sales-section'));
    document.getElementById('proveedor-btn').addEventListener('click', () => mostrarSeccion('proveedor-section'));
    document.getElementById('reportes-btn').addEventListener('click', () => {
        mostrarSeccion('reportes-section');
        consultarReportes();
    });
    document.getElementById('productos-btn').addEventListener('click', () => {
        mostrarSeccion('productos-section');
        cargarProductosEnFormulario();
    });
}

// Inicializar la página cuando se carga
window.onload = function() {
    verificarAutenticacion();
    inicializarNavegacion();

    consultarInventario();
    consultarCompras();
    consultarVentas();
    consultarProveedores();
    mostrarNotificaciones();

    document.getElementById('purchase-form').addEventListener('submit', registrarCompra);
    document.getElementById('sales-form').addEventListener('submit', registrarVenta);
    document.getElementById('supplier-form').addEventListener('submit', registrarProveedor);
    document.getElementById('product-form').addEventListener('submit', guardarCambiosProducto);
    document.getElementById('product-select').addEventListener('change', mostrarProductoParaEditar);
};
