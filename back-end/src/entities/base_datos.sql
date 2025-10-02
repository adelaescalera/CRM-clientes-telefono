--Este fichero no se usa

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

-- Tabla consumo (entidad débil de teléfono)
CREATE TABLE consumo (
    consumo_id INT AUTO_INCREMENT PRIMARY KEY,
    phone_id INT NOT NULL,
    consumo DECIMAL(10,2) NOT NULL,
    mes INT NOT NULL CHECK (mes BETWEEN 1 AND 12),
    anio INT NOT NULL CHECK (anio >= 1960),
    FOREIGN KEY (phone_id) REFERENCES telefono(phone_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
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

--para luego meter datos desde base de consumos
 INSERT INTO cliente (nombre, dni, direccion)
VALUES ('Cliente Uno', '1234568A', 'Calle Falsa 1'),
('Cliente Dos', '8765421B', 'Avenida Siempre Viva 2');


INSERT INTO telefono (id_cliente, numero, type)
 VALUES (34, '600111111', 'mobile'),
 (35, '600222222', 'landline');


-- Consumidos por Cliente 1, teléfono 1
INSERT INTO consumo (phone_id, consumo, mes, anio)
VALUES
  (65, 12.50, 1, 2025), 
  (65, 15.75, 2, 2025), 
  (65, 10.00, 3, 2025); 

-- Consumidos por Cliente 2, teléfono 2
INSERT INTO consumo (phone_id, consumo, mes, anio)
VALUES
  (66, 8.20, 1, 2025), 
  (66, 9.50, 2, 2025), 
  (66, 11.00, 3, 2025); 