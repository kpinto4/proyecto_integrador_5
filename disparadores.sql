
CREATE TRIGGER actualizarStockCompra AFTER INSERT ON compras
FOR EACH ROW
BEGIN
    UPDATE productos SET stock = stock + NEW.cantidad WHERE codigo_producto = NEW.codigo_producto;
END;

END;
