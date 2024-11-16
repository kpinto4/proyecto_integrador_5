
CREATE PROCEDURE insertarProducto (
    IN codigo VARCHAR(50), IN nombre VARCHAR(100), IN proveedor INT, IN stock INT, IN fecha DATE
)
BEGIN
    INSERT INTO productos (codigo_producto, nombre_producto, proveedor_id, stock, fecha_ingreso, estado, activo)
    VALUES (codigo, nombre, proveedor, stock, fecha, 'disponible', TRUE);
END;

-- Procedimiento para actualizar el stock
CREATE PROCEDURE actualizarStock (
    IN codigo VARCHAR(50), IN nuevaCantidad INT
)
BEGIN
    UPDATE productos SET stock = nuevaCantidad WHERE codigo_producto = codigo;
END;
