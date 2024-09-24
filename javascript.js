document.addEventListener('DOMContentLoaded', function () {

    // Toggle form visibility for Proveedor
    const proveedorForm = document.getElementById('proveedorForm');
    const toggleProveedorButton = document.getElementById('toggleProveedorForm');
    toggleProveedorButton.addEventListener('click', function() {
        proveedorForm.classList.toggle('hidden-form');
    });

    // Toggle form visibility for Inventario
    const inventarioForm = document.getElementById('inventarioForm');
    const toggleInventarioButton = document.getElementById('toggleInventarioForm');
    toggleInventarioButton.addEventListener('click', function() {
        inventarioForm.classList.toggle('hidden-form');
    });

    // Handle form submission for Proveedor
    document.getElementById('proveedorForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Get input values
        const codigo = document.getElementById('codigo').value;
        const tipo = document.getElementById('tipo').value;
        const nombreProveedor = document.getElementById('nombreProveedor').value;
        const telefono = document.getElementById('telefono').value;
        const direccion = document.getElementById('direccion').value;
        const estado = document.getElementById('estado').value;

        // Add new row to Proveedor table
        const table = document.getElementById('proveedorTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td>${codigo}</td>
            <td>${tipo}</td>
            <td>${nombreProveedor}</td>
            <td>${telefono}</td>
            <td>${direccion}</td>
            <td>${estado}</td>
        `;

        // Clear form inputs
        this.reset();
        proveedorForm.classList.add('hidden-form');
    });

    // Handle form submission for Inventario
    document.getElementById('inventarioForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Get input values
        const codigoProducto = document.getElementById('codigoProducto').value;
        const producto = document.getElementById('producto').value;
        const proveedorProducto = document.getElementById('proveedorProducto').value;
        const estadoProducto = document.getElementById('estadoProducto').value;
        const stock = document.getElementById('stock').value;
        const precio = document.getElementById('precio').value;
        const fechaIngreso = document.getElementById('fechaIngreso').value;

        // Add new row to Inventario table
        const table = document.getElementById('inventarioTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td>${codigoProducto}</td>
            <td>${producto}</td>
            <td>${proveedorProducto}</td>
            <td>${estadoProducto}</td>
            <td>${stock}</td>
            <td>${precio}</td>
            <td>${fechaIngreso}</td>
            <td><button><i class="fas fa-edit"></i> Editar</button></td>
        `;

        // Clear form inputs
        this.reset();
        inventarioForm.classList.add('hidden-form');
    });

    // Chart.js initialization
    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Categoría 1', 'Categoría 2', 'Categoría 3', 'Categoría 4'],
            datasets: [{
                label: 'Serie 1',
                data: [12, 19, 3, 5],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Serie 2',
                data: [2, 3, 20, 3],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
