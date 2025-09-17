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
