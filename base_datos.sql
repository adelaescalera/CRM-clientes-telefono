CREATE DATABASE proyecto1;
USE proyecto1;

-- Tabla cliente
CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    DNI VARCHAR(20) UNIQUE,
    Nombre VARCHAR(40),
    Direccion VARCHAR(50)
);

-- Tabla telefono
CREATE TABLE telefono (
    numero VARCHAR(20) PRIMARY KEY,
    id_cliente INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

SHOW tables;

DESCRIBE cliente;

