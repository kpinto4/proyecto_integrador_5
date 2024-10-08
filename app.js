document.addEventListener("DOMContentLoaded", function() {
    // Simulación de usuarios con roles
    const users = {
        felipe: { password: "1234", role: "Administrador" },
        ana: { password: "abcd", role: "Usuario" },
        carlos: { password: "4567", role: "Supervisor" }
    };

    // Verifica si estamos en la página de login
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        // Manejar el evento de envío del formulario de inicio de sesión
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevenir la recarga de la página
            const usernameInput = document.getElementById("username").value.toLowerCase(); // Convertir el usuario a minúsculas
            const passwordInput = document.getElementById("password").value;

            // Verificar si el usuario existe y la contraseña es correcta
            if (users[usernameInput] && users[usernameInput].password === passwordInput) {
                // Guardar el nombre y rol del usuario en localStorage
                localStorage.setItem("username", usernameInput);
                localStorage.setItem("role", users[usernameInput].role);

                // Redirigir al sistema de inventario
                window.location.href = "inventory.html";
            } else {
                document.getElementById("login-error").innerText = "Usuario o contraseña incorrectos."; // Mostrar error
            }
        });
    }

    // Verificar si estamos en la página de inventario
    if (window.location.pathname.endsWith("inventory.html")) {
        const username = localStorage.getItem("username");
        const role = localStorage.getItem("role");

        if (username && role) {
            // Mostrar el nombre y rol del usuario en la interfaz
            document.getElementById("username-display").textContent = username;
            document.getElementById("role-display").textContent = role;

            showTable('inicio-table');
        } else {
            // Si no hay usuario en localStorage, redirigir al login
            window.location.href = "login.html";
        }
    }

    // Asignar eventos a los botones de navegación para cambiar de sección
    document.getElementById("inicio-btn").addEventListener("click", () => showTable("inicio-table"));
    document.getElementById("inventario-btn").addEventListener("click", () => showTable("inventario-table"));
    document.getElementById("proveedor-btn").addEventListener("click", () => showTable("proveedor-table"));
    document.getElementById("reportes-btn").addEventListener("click", () => showTable("reportes-table"));
    document.getElementById("purchase-btn").addEventListener("click", () => showTable("purchase-table"));
    document.getElementById("sales-btn").addEventListener("click", () => showTable("sales-table"));

    // Manejar el cierre de sesión
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("username"); // Eliminar nombre de usuario
        localStorage.removeItem("role"); // Eliminar rol del usuario
        window.location.href = "login.html"; // Redirigir al login
    });

    // Función para mostrar una tabla según la sección seleccionada
    function showTable(tableId) {
        const tables = document.querySelectorAll('.table-section'); // Seleccionar todas las secciones de tabla
        tables.forEach(table => table.style.display = 'none'); // Ocultar todas las tablas
        document.getElementById(tableId).style.display = 'block'; // Mostrar solo la tabla seleccionada
    }

    // Función para mostrar la lista del inventario en la tabla
    function renderInventory() {
        const inventoryList = document.getElementById("inventory-list");
        inventoryList.innerHTML = ""; // Limpiar la lista actual

        // Obtener inventario de localStorage o inicializar un array vacío
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.productCode}</td>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>${item.supplier}</td>
                <td>${item.dateAdded}</td>
            `;
            inventoryList.appendChild(row); // Añadir fila a la tabla
        });
    }

    // Función para generar un código único para un producto
    function generateProductCode(productName) {
        return productName.charAt(0).toUpperCase() + Math.floor(Math.random() * 10000);
    }

    // Validación para campos vacíos
    function isFieldEmpty(value) {
        return value.trim() === ""; // Verifica si el campo está vacío o contiene solo espacios
    }

    // Función para manejar el registro de compras
    const addPurchaseButton = document.getElementById("add-purchase-btn");
    addPurchaseButton.addEventListener("click", function() {
        const productName = document.getElementById("purchase-product-name").value;
        const productQuantity = parseInt(document.getElementById("purchase-product-quantity").value);
        const supplier = document.getElementById("purchase-product-supplier").value;
        const purchaseCost = document.getElementById("purchase-cost").value;

        // Validar si los campos están vacíos
        if (isFieldEmpty(productName) || isFieldEmpty(supplier) || isNaN(productQuantity) || isFieldEmpty(purchaseCost)) {
            alert("Por favor, complete todos los campos correctamente.");
            return;
        }

        // Generar código de producto y obtener la fecha actual
        const productCode = generateProductCode(productName);
        const purchaseDate = new Date().toLocaleDateString();

        // Obtener compras actuales de localStorage o inicializar un array vacío
        const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
        purchases.push({ productCode, productName, productQuantity, supplier, purchaseDate, purchaseCost });
        localStorage.setItem("purchases", JSON.stringify(purchases)); // Guardar en localStorage

        // Actualizar el inventario
        let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const productIndex = inventory.findIndex(item => item.productName === productName);

        if (productIndex >= 0) {
            // Si el producto ya existe, sumar la cantidad
            inventory[productIndex].quantity += productQuantity;
        } else {
            // Si es un nuevo producto, agregarlo al inventario
            inventory.push({ productCode, productName, quantity: productQuantity, supplier, dateAdded: purchaseDate });
        }

        localStorage.setItem("inventory", JSON.stringify(inventory)); // Guardar el inventario actualizado

        // Actualizar las tablas de inventario y compras
        renderInventory();
        renderPurchases();
        checkLowStock(); // Verificar si hay productos con stock bajo

        // Limpiar los campos del formulario después de registrar la compra
        document.getElementById("purchase-product-name").value = '';
        document.getElementById("purchase-product-quantity").value = '';
        document.getElementById("purchase-product-supplier").value = '';
        document.getElementById("purchase-cost").value = '';
    });

    // Función para mostrar el historial de compras
    function renderPurchases() {
        const purchaseList = document.getElementById("purchase-list");
        purchaseList.innerHTML = ""; // Limpiar lista actual

        const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
        purchases.forEach(purchase => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${purchase.productCode}</td>
                <td>${purchase.productName}</td>
                <td>${purchase.productQuantity}</td>
                <td>${purchase.supplier}</td>
                <td>${purchase.purchaseDate}</td>
                <td>${purchase.purchaseCost}</td>
            `;
            purchaseList.appendChild(row); // Agregar fila a la tabla
        });
    }

    // Función para manejar el registro de ventas
    const addSalesButton = document.getElementById("add-sales-btn");
    addSalesButton.addEventListener("click", function() {
        const productName = document.getElementById("sales-product-name").value;
        const productQuantity = parseInt(document.getElementById("sales-product-quantity").value);
        const customer = document.getElementById("sales-customer").value;
        const salesTotal = document.getElementById("sales-total").value;

        // Validar campos vacíos
        if (isFieldEmpty(productName) || isNaN(productQuantity) || isFieldEmpty(customer) || isFieldEmpty(salesTotal)) {
            alert("Por favor, complete todos los campos correctamente.");
            return;
        }

        let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const productIndex = inventory.findIndex(item => item.productName === productName);

        if (productIndex >= 0) {
            if (inventory[productIndex].quantity >= productQuantity) {
                inventory[productIndex].quantity -= productQuantity; // Reducir cantidad en inventario
                if (inventory[productIndex].quantity === 0) {
                    inventory.splice(productIndex, 1); // Eliminar producto si la cantidad es 0
                }

                // Registrar la venta
                const sales = JSON.parse(localStorage.getItem("sales")) || [];
                const salesDate = new Date().toLocaleDateString(); // Fecha actual
                sales.push({ productName, productQuantity, customer, salesDate, salesTotal });
                localStorage.setItem("sales", JSON.stringify(sales)); // Guardar ventas en localStorage
                localStorage.setItem("inventory", JSON.stringify(inventory)); // Guardar inventario actualizado
                renderSales();
                renderInventory();
                checkLowStock(); // Verificar si hay productos con stock bajo
            } else {
                alert("Cantidad insuficiente en el inventario para la venta.");
            }
        } else {
            alert("El producto no existe en el inventario.");
        }
    });

    // Función para mostrar el historial de ventas
    function renderSales() {
        const salesList = document.getElementById("sales-list");
        salesList.innerHTML = ""; // Limpiar lista actual

        const sales = JSON.parse(localStorage.getItem("sales")) || [];
        sales.forEach(sale => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${sale.productName}</td>
                <td>${sale.productQuantity}</td>
                <td>${sale.customer}</td>
                <td>${sale.salesDate}</td>
                <td>${sale.salesTotal}</td>
            `;
            salesList.appendChild(row); // Agregar fila a la tabla
        });
    }

    // Función para manejar el registro de proveedores
    const addSupplierButton = document.getElementById("add-supplier-btn");
    addSupplierButton.addEventListener("click", function() {
        const supplierCode = document.getElementById("supplier-code").value;
        const supplierType = document.getElementById("supplier-type").value;
        const supplierName = document.getElementById("supplier-name").value;
        const supplierPhone = document.getElementById("supplier-phone").value;
        const supplierAddress = document.getElementById("supplier-address").value;
        const supplierStatus = document.getElementById("supplier-status").value;

        // Validar campos vacíos
        if (isFieldEmpty(supplierCode) || isFieldEmpty(supplierName) || isFieldEmpty(supplierPhone)) {
            alert("Por favor, complete todos los campos correctamente.");
            return;
        }

        const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
        const supplierIndex = suppliers.findIndex(supplier => supplier.supplierCode === supplierCode);

        if (supplierIndex >= 0) {
            suppliers[supplierIndex] = { supplierCode, supplierType, supplierName, supplierPhone, supplierAddress, supplierStatus };
        } else {
            suppliers.push({ supplierCode, supplierType, supplierName, supplierPhone, supplierAddress, supplierStatus });
        }

        localStorage.setItem("suppliers", JSON.stringify(suppliers)); // Guardar proveedores en localStorage
        renderSuppliers();
    });

    function renderSuppliers() {
        const supplierList = document.getElementById("supplier-list");
        supplierList.innerHTML = ""; // Limpiar lista actual
    
        const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
        suppliers.forEach((supplier, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${supplier.supplierCode}</td>
                <td>${supplier.supplierType}</td>
                <td>${supplier.supplierName}</td>
                <td>${supplier.supplierPhone}</td>
                <td>${supplier.supplierAddress}</td>
                <td>${supplier.supplierStatus}</td>
                <td><button class="delete-btn" data-index="${index}">Eliminar</button></td> <!-- Botón de eliminar -->
            `;
            supplierList.appendChild(row); // Agregar fila a la tabla
        });
    
        // Agregar evento de eliminación a cada botón de eliminar
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                deleteSupplier(index);
            });
        });
    }

    function deleteSupplier(index) {
        let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
        suppliers.splice(index, 1); // Elimina el proveedor del array
        localStorage.setItem("suppliers", JSON.stringify(suppliers)); // Actualiza localStorage
        renderSuppliers(); // Actualiza la lista de proveedores
    }

    // Función para verificar si hay productos con bajo stock
    function checkLowStock() {
        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const lowStockProducts = inventory.filter(item => item.quantity < 10);

        const lowStockMessage = document.getElementById("low-stock-message");
        if (lowStockProducts.length > 0) {
            let message = "Atención: Los siguientes productos tienen bajo stock:<br><ul>";
            lowStockProducts.forEach(item => {
                message += `<li>${item.productName} (Stock: ${item.quantity})</li>`;
            });
            message += "</ul>";
            lowStockMessage.innerHTML = message;
            lowStockMessage.style.display = "block"; // Mostrar mensaje de bajo stock
        } else {
            lowStockMessage.style.display = "none"; // Ocultar si no hay productos con bajo stock
        }
    }

    // Verificar si estamos en la página de inventario y cargar la información
    if (window.location.pathname.endsWith("inventory.html")) {
        renderInventory();
        renderPurchases();
        renderSales();
        renderSuppliers();
        checkLowStock(); // Verificar productos con bajo stock al cargar la página
    }
});
