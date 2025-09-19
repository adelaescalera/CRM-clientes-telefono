import { Entity, Index, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Telefono } from "./telefono";
import config from "../config/config";

@Entity("cliente", { database: config.db.database })
@Index("dni", ["dni"], { unique: true })
export class Cliente {
  
  @PrimaryGeneratedColumn({ name: "id_cliente", type: "int" })
  referencia!: number;

  @Column("varchar", { name: "DNI", length: 20, unique: true })
  dni!: string;

  @Column("text", { name: "Nombre" })
  nombre!: string;

  @Column("varchar", { name: "Direccion", length: 50, nullable: true })
  direccion!: string;

  @OneToMany(() => Telefono, (telefono) => telefono.cliente)
  telefonos!: Telefono[];
}

/*
CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    DNI VARCHAR(20) UNIQUE,
    Nombre TEXT,
    Direccion VARCHAR(50)
);
*/
