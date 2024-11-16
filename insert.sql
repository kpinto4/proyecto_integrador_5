
INSERT INTO usuarios (nombre_usuario, contrasena, rol) VALUES 
('admin', 'contrasena_encriptada', 'administrador'),
('usuario1', 'contrasena_encriptada', 'usuario');


INSERT INTO proveedores (codigo_proveedor, nombre, telefono, direccion, estado, activo) VALUES 
('PROV001', 'Proveedor 1', '1234567890', 'Calle Falsa 123', 'activo', TRUE);


INSERT INTO productos (codigo_producto, nombre_producto, proveedor_id, stock, fecha_ingreso, estado, activo) VALUES 
('PROD001', 'Producto 1', 1, 100, '2024-01-01', 'disponible', TRUE);


INSERT INTO compras (codigo_producto, proveedor_id, cantidad, fecha, costo_total) VALUES 
('PROD001', 1, 50, '2024-01-02', 500.00);


INSERT INTO ventas (codigo_producto, cantidad, cliente, fecha, total_venta) VALUES 
('PROD001', 10, 'Cliente 1', '2024-01-03', 150.00);
