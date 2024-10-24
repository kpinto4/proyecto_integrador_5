// Función para cargar datos desde un archivo JSON estático
async function cargarDatosDesdeArchivo(ruta) {
    try {
        const response = await fetch(ruta);
        if (!response.ok) {
            throw new Error(`Error al cargar ${ruta}: ${response.statusText}`);
        }
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return [];
    }
}

// Función para guardar datos en archivos JSON simulados (esto no es posible directamente desde JavaScript del lado del cliente)
function guardarDatosSimulados(clave, datos) {
    console.log(`Datos que se guardarían en ${clave}:`, datos);
    alert('No se puede guardar directamente en archivos JSON desde el cliente.');
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
    const lote = 'L' + fecha.getFullYear().toString().slice(-2) +
                 ('0' + (fecha.getMonth() + 1)).slice(-2) +
                 ('0' + fecha.getDate()).slice(-2) +
                 '-' + Math.floor(1000 + Math.random() * 9000);
    return lote;
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

    // Nueva compra
    const nuevaCompra = {
        id: Date.now(),
        producto: productoNombre,
        lote: lote,
        precio: precioUnitario,
        cantidad: cantidadComprada,
        proveedor: proveedorSeleccionado,
        fecha: fechaCompra
    };

    // Cargar datos de compras.json
    const compras = await cargarDatosDesdeArchivo('compras.json');
    compras.push(nuevaCompra);
    guardarDatosSimulados('compras.json', compras);

    // Actualizar el inventario con la nueva compra
    const productos = await cargarDatosDesdeArchivo('productos.json');
    const productoExistente = productos.find(p => p.nombre === productoNombre);

    if (productoExistente) {
        // Si el producto ya existe, solo actualizamos el stock
        productoExistente.stock += cantidadComprada;
    } else {
        // Si es un producto nuevo, lo agregamos al inventario
        const nuevoProducto = {
            id: Date.now(),
            nombre: productoNombre,
            lote: lote,
            precio: precioUnitario,
            stock: cantidadComprada,
            fechaIngreso: fechaCompra
        };
        productos.push(nuevoProducto);
    }

    // Guardar el inventario actualizado
    guardarDatosSimulados('productos.json', productos);

    consultarInventario(); // Actualizar la tabla del inventario
    consultarCompras(); // Actualizar la tabla de compras
    consultarReportes(); // Actualizar los reportes
    alert(`Compra registrada con éxito. Lote asignado: ${lote}`);
}

// Función para registrar una venta y actualizar el inventario
async function registrarVenta(event) {
    event.preventDefault();

    const productoId = parseInt(document.getElementById('sales-product-id').value, 10);
    const cantidadVendida = parseInt(document.getElementById('sales-quantity').value, 10);
    const fecha = new Date().toISOString().split('T')[0];

    const productos = await cargarDatosDesdeArchivo('productos.json');
    const producto = productos.find(p => p.id === productoId);

    if (producto && producto.stock >= cantidadVendida) {
        const totalVenta = producto.precio * cantidadVendida;

        const nuevaVenta = {
            id: Date.now(),
            producto: producto.nombre,
            cantidad: cantidadVendida,
            fecha: fecha,
            total: totalVenta
        };

        producto.stock -= cantidadVendida;

        let ventas = await cargarDatosDesdeArchivo('ventas.json');
        ventas.push(nuevaVenta);
        guardarDatosSimulados('ventas.json', ventas);

        guardarDatosSimulados('productos.json', productos); // Actualizar el stock en productos

        alert('Venta registrada con éxito');
        consultarVentas(); // Actualizar la tabla de ventas
        consultarInventario(); // Actualizar la tabla del inventario
        consultarReportes(); // Actualizar los reportes
    } else {
        alert('Stock insuficiente o producto no encontrado');
    }
}

// Función para consultar y mostrar el inventario en la tabla
async function consultarInventario() {
    const productos = await cargarDatosDesdeArchivo('productos.json');
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
    const compras = await cargarDatosDesdeArchivo('compras.json');
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
    const ventas = await cargarDatosDesdeArchivo('ventas.json');
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

// Función para consultar los reportes de compras y ventas y mostrarlos en la sección de reportes
async function consultarReportes() {
    // Reportes de compras
    const compras = await cargarDatosDesdeArchivo('compras.json');
    let tablaReportesCompras = '';

    compras.forEach(compra => {
        tablaReportesCompras += `<tr>
            <td>${compra.id}</td>
            <td>${compra.producto}</td>
            <td>${compra.cantidad}</td>
            <td>${compra.proveedor}</td>
            <td>${compra.fecha}</td>
            <td>${compra.precio * compra.cantidad}</td> <!-- Total calculado -->
        </tr>`;
    });

    document.getElementById('report-compras-list').innerHTML = tablaReportesCompras;

    // Reportes de ventas
    const ventas = await cargarDatosDesdeArchivo('ventas.json');
    let tablaReportesVentas = '';

    ventas.forEach(venta => {
        tablaReportesVentas += `<tr>
            <td>${venta.id}</td>
            <td>${venta.producto}</td>
            <td>${venta.cantidad}</td>
            <td>${venta.fecha}</td>
            <td>${venta.total}</td>
        </tr>`;
    });

    document.getElementById('report-ventas-list').innerHTML = tablaReportesVentas;
}

// Función para registrar un proveedor
async function registrarProveedor(event) {
    event.preventDefault();

    const id = generarCodigoProveedor();
    const nombre = document.getElementById('supplier-name').value;
    const direccion = document.getElementById('supplier-address').value;
    const ciudad = document.getElementById('supplier-city').value;
    const telefono = document.getElementById('supplier-phone').value;
    const estado = document.getElementById('supplier-status').value;

    const nuevoProveedor = { id, nombre, direccion, ciudad, telefono, estado };

    const proveedores = await cargarDatosDesdeArchivo('proveedores.json');

    // Verificar si ya existe un proveedor con el mismo nombre
    const proveedorExistente = proveedores.find(p => p.nombre === nombre);
    if (proveedorExistente) {
        alert('Ya existe un proveedor con ese nombre');
        return;
    }

    proveedores.push(nuevoProveedor);
    guardarDatosSimulados('proveedores.json', proveedores);

    consultarProveedores();
    alert('Proveedor registrado con éxito');
}

// Función para generar automáticamente el código de proveedor
function generarCodigoProveedor() {
    const fecha = new Date();
    return 'P' + fecha.getFullYear().toString().slice(-2) +
           ('0' + (fecha.getMonth() + 1)).slice(-2) +
           ('0' + fecha.getDate()).slice(-2) +
           '-' + Math.floor(1000 + Math.random() * 9000);
}

// Función para consultar y mostrar los proveedores en la tabla de proveedores
async function consultarProveedores() {
    const proveedores = await cargarDatosDesdeArchivo('proveedores.json');
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

    // Cargar proveedores en el select de compras
    const proveedorSelect = document.getElementById('purchase-provider');
    proveedorSelect.innerHTML = '<option value="">Seleccione un Proveedor</option>'; // Resetear las opciones
    proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor.nombre;
        option.textContent = proveedor.nombre;
        proveedorSelect.appendChild(option);
    });
}

// Función para mostrar las notificaciones
async function mostrarNotificaciones() {
    const productos = await cargarDatosDesdeArchivo('productos.json');
    const notificacionesList = document.getElementById('notificaciones-list');
    notificacionesList.innerHTML = ''; // Limpiar las notificaciones previas

    productos.forEach(producto => {
        const fechaIngreso = new Date(producto.fechaIngreso);
        const fechaActual = new Date();
        const diferenciaDias = Math.floor((fechaActual - fechaIngreso) / (1000 * 60 * 60 * 24));

        // Notificar si el producto está a punto de caducar (por ejemplo, después de 7 días)
        if (diferenciaDias >= 6) {
            const notificacion = document.createElement('li');
            notificacion.textContent = `El producto "${producto.nombre}" está a punto de caducar.`;
            const marcarRealizada = document.createElement('button');
            marcarRealizada.textContent = 'Marcar como realizada';
            marcarRealizada.addEventListener('click', () => {
                notificacionesList.removeChild(notificacion); // Eliminar la notificación al marcarla
            });
            notificacion.appendChild(marcarRealizada);
            notificacionesList.appendChild(notificacion);
        }

        // Notificar si el stock es menor de 10
        if (producto.stock < 10) {
            const notificacionBajoStock = document.createElement('li');
            notificacionBajoStock.textContent = `El producto "${producto.nombre}" tiene un stock bajo (${producto.stock} unidades).`;
            const marcarRealizada = document.createElement('button');
            marcarRealizada.textContent = 'Marcar como realizada';
            marcarRealizada.addEventListener('click', () => {
                notificacionesList.removeChild(notificacionBajoStock); // Eliminar la notificación al marcarla
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
}

// Inicializar la página cuando se carga
window.onload = function() {
    verificarAutenticacion();
    inicializarNavegacion();

    consultarInventario();
    consultarCompras();
    consultarVentas();
    consultarProveedores();
    mostrarNotificaciones(); // Mostrar notificaciones

    // Manejar los formularios de compra, venta y proveedor
    document.getElementById('purchase-form').addEventListener('submit', registrarCompra);
    document.getElementById('sales-form').addEventListener('submit', registrarVenta);
    document.getElementById('supplier-form').addEventListener('submit', registrarProveedor);
};
