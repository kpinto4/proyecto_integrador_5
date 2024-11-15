CREATE DATABASE la_canasta;
USE la_canasta;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL, 
    rol ENUM('administrador', 'usuario', 'supervisor') NOT NULL
);


CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_proveedor VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    estado ENUM('activo', 'inactivo') NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);


CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_producto VARCHAR(50) NOT NULL UNIQUE,
    nombre_producto VARCHAR(100) NOT NULL,
    proveedor_id INT NOT NULL,
    stock INT NOT NULL,
    fecha_ingreso DATE NOT NULL,
    estado ENUM('disponible', 'agotado') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);


CREATE TABLE compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_producto VARCHAR(50) NOT NULL,
    proveedor_id INT NOT NULL,
    cantidad INT NOT NULL,
    fecha DATE NOT NULL,
    costo_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (codigo_producto) REFERENCES productos(codigo_producto),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
);


CREATE TABLE ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_producto VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL,
    cliente VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL,
    total_venta DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (codigo_producto) REFERENCES productos(codigo_producto)
);

