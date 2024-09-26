document.addEventListener("DOMContentLoaded", function() {
    // Simulación de usuarios con roles
    const users = {
        felipe: { password: "1234", role: "Administrador" },
        ana: { password: "abcd", role: "Usuario" },
        carlos: { password: "4567", role: "Supervisor" }
    };

    // Verificar si estamos en la página de login
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        // Manejar el formulario de inicio de sesión
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const usernameInput = document.getElementById("username").value.toLowerCase();
            const passwordInput = document.getElementById("password").value;

            if (users[usernameInput] && users[usernameInput].password === passwordInput) {
                // Guardar el nombre y rol del usuario en localStorage
                localStorage.setItem("username", usernameInput);
                localStorage.setItem("role", users[usernameInput].role);

                // Redirigir al sistema (inventory.html)
                window.location.href = "inventory.html";
            } else {
                document.getElementById("login-error").innerText = "Usuario o contraseña incorrectos.";
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
        } else {
            // Si no hay usuario almacenado, redirigir al login
            window.location.href = "login.html";
        }
    }

    // Botones de menú para cambiar de sección
    document.getElementById("inicio-btn").addEventListener("click", () => showTable("inicio-table"));
    document.getElementById("inventario-btn").addEventListener("click", () => showTable("inventario-table"));
    document.getElementById("proveedor-btn").addEventListener("click", () => showTable("proveedor-table"));
    document.getElementById("reportes-btn").addEventListener("click", () => showTable("reportes-table"));
    document.getElementById("purchase-btn").addEventListener("click", () => showTable("purchase-table"));
    document.getElementById("sales-btn").addEventListener("click", () => showTable("sales-table"));

    // Manejar el cierre de sesión
    document.getElementById("logout-btn").addEventListener("click", () => {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        window.location.href = "login.html"; // Redirige al login al cerrar sesión
    });

    // Función para mostrar una tabla según el botón
    function showTable(tableId) {
        const tables = document.querySelectorAll('.table-section');
        tables.forEach(table => table.style.display = 'none');
        document.getElementById(tableId).style.display = 'block';
    }

    // Función para mostrar el inventario
    function renderInventory() {
        const inventoryList = document.getElementById("inventory-list");
        inventoryList.innerHTML = "";

        const inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        inventory.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
            `;
            inventoryList.appendChild(row);
        });
    }

    // Función para generar un código automático para el producto
    function generateProductCode(productName) {
        return productName.charAt(0).toUpperCase() + Math.floor(Math.random() * 10000);
    }

    // Registrar compras (agregar productos al inventario)
    const addPurchaseButton = document.getElementById("add-purchase-btn");
    addPurchaseButton.addEventListener("click", function() {
        const productName = document.getElementById("purchase-product-name").value;
        const productQuantity = parseInt(document.getElementById("purchase-product-quantity").value);
        const supplier = document.getElementById("purchase-product-supplier").value;
        const purchaseCost = document.getElementById("purchase-cost").value;

        // Generar código de producto
        const productCode = generateProductCode(productName);

        // Obtener la fecha actual del sistema
        const purchaseDate = new Date().toLocaleDateString();

        const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
        purchases.push({ productCode, productName, productQuantity, supplier, purchaseDate, purchaseCost });
        localStorage.setItem("purchases", JSON.stringify(purchases));

        // Agregar productos al inventario
        let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const productIndex = inventory.findIndex(item => item.productName === productName);

        if (productIndex >= 0) {
            inventory[productIndex].quantity += productQuantity; // Actualizar cantidad si el producto ya existe
        } else {
            inventory.push({ productCode, productName, quantity: productQuantity, supplier, dateAdded: purchaseDate }); // Agregar nuevo producto al inventario
        }

        localStorage.setItem("inventory", JSON.stringify(inventory));
        renderInventory();
        renderPurchases();
    });

    // Función para mostrar el historial de compras
    function renderPurchases() {
        const purchaseList = document.getElementById("purchase-list");
        purchaseList.innerHTML = "";

        const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
        purchases.forEach(purchase => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${purchase.productName}</td>
                <td>${purchase.productQuantity}</td>
                <td>${purchase.supplier}</td>
                <td>${purchase.purchaseDate}</td>
                <td>${purchase.purchaseCost}</td>
            `;
            purchaseList.appendChild(row);
        });
    }

    // Registrar ventas (reducir productos del inventario)
    const addSalesButton = document.getElementById("add-sales-btn");
    addSalesButton.addEventListener("click", function() {
        const productName = document.getElementById("sales-product-name").value;
        const productQuantity = parseInt(document.getElementById("sales-product-quantity").value);
        const customer = document.getElementById("sales-customer").value;
        const salesDate = document.getElementById("sales-date").value;
        const salesTotal = document.getElementById("sales-total").value;

        let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
        const productIndex = inventory.findIndex(item => item.productName === productName);

        if (productIndex >= 0) {
            if (inventory[productIndex].quantity >= productQuantity) {
                inventory[productIndex].quantity -= productQuantity; // Reducir cantidad del inventario
                if (inventory[productIndex].quantity === 0) {
                    inventory.splice(productIndex, 1); // Eliminar el producto si la cantidad es 0
                }

                const sales = JSON.parse(localStorage.getItem("sales")) || [];
                sales.push({ productName, productQuantity, customer, salesDate, salesTotal });
                localStorage.setItem("sales", JSON.stringify(sales));
                localStorage.setItem("inventory", JSON.stringify(inventory));
                renderSales();
                renderInventory();
            } else {
                alert("Cantidad insuficiente en el inventario para la venta.");
            }
        } else {
            alert("El producto no existe en el inventario.");
        }
    });

    // Función para mostrar las ventas
    function renderSales() {
        const salesList = document.getElementById("sales-list");
        salesList.innerHTML = "";

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
            salesList.appendChild(row);
        });
    }

    // Función para manejar proveedores
    const addSupplierButton = document.getElementById("add-supplier-btn");
    addSupplierButton.addEventListener("click", function() {
        const supplierCode = document.getElementById("supplier-code").value;
        const supplierType = document.getElementById("supplier-type").value;
        const supplierName = document.getElementById("supplier-name").value;
        const supplierPhone = document.getElementById("supplier-phone").value;
        const supplierAddress = document.getElementById("supplier-address").value;
        const supplierStatus = document.getElementById("supplier-status").value;

        const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
        const supplierIndex = suppliers.findIndex(supplier => supplier.supplierCode === supplierCode);

        if (supplierIndex >= 0) {
            suppliers[supplierIndex] = { supplierCode, supplierType, supplierName, supplierPhone, supplierAddress, supplierStatus };
        } else {
            suppliers.push({ supplierCode, supplierType, supplierName, supplierPhone, supplierAddress, supplierStatus });
        }

        localStorage.setItem("suppliers", JSON.stringify(suppliers));
        renderSuppliers();
    });

    // Función para mostrar la lista de proveedores
    function renderSuppliers() {
        const supplierList = document.getElementById("supplier-list");
        supplierList.innerHTML = "";

        const suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
        suppliers.forEach(supplier => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${supplier.supplierCode}</td>
                <td>${supplier.supplierType}</td>
                <td>${supplier.supplierName}</td>
                <td>${supplier.supplierPhone}</td>
                <td>${supplier.supplierAddress}</td>
                <td>${supplier.supplierStatus}</td>
            `;
            supplierList.appendChild(row);
        });
    }

    if (window.location.pathname.endsWith("inventory.html")) {
        renderInventory();
        renderPurchases();
        renderSales();
        renderSuppliers();
    }
});
