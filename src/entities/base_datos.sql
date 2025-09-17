CREATE DATABASE proyecto1;
USE proyecto1;

-- Tabla cliente
CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    DNI VARCHAR(20) UNIQUE,
    Nombre TEXT,
    Direccion VARCHAR(50)
);

-- Tabla telefono
CREATE TABLE telefono (
    phone_id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NULL,
    numero VARCHAR(20) UNIQUE,
    type ENUM('mobile','landline','office') NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
        ON UPDATE CASCADE
        ON DELETE SET NULL
);

SHOW tables;

DESCRIBE cliente;



 Insertar datos en cliente
INSERT INTO cliente (DNI, Nombre, Direccion) VALUES
('12345678A', 'Ana Pérez', 'Calle Falsa 123'),
('87654321B', 'Luis Gómez', 'Avenida Siempre Viva 742'),
('11223344C', 'María López', 'Plaza Mayor 1');

Insertar datos en telefono
INSERT INTO telefono (id_cliente, numero, type) VALUES
(1, '+34123456789', 'mobile'),
(1, '+34987654321', 'landline'),
(2, '+34611223344', 'mobile'),
(2, '+34887766554', 'office'),
(3, '+34999888777', 'mobile'),
(NULL, '+34999112233', 'landline'); -- teléfono sin cliente asignado

-- Ver datos iniciales
SELECT * FROM cliente;
SELECT * FROM telefono;

-- Borrar un cliente (ejemplo: Ana Pérez)
DELETE FROM cliente WHERE id_cliente = 1;

-- Ver cómo quedan los teléfonos después de borrar
SELECT * FROM telefono;