import { Entity, Index, Column, OneToMany, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Telefono } from "./telefono";
import config from "../config/config";
import { Usuario } from "./usuario";

@Entity("cliente", { database: config.db.database })
@Index("dni", ["dni"], { unique: true })
export class Cliente {

  @PrimaryGeneratedColumn({ name: "id_cliente", type: "int" })
  id!: number;

  @Column("varchar", { name: "DNI", length: 20, unique: true })
  dni!: string;

  @Column("text", { name: "Nombre" })
  nombre!: string;

  @Column("varchar", { name: "Direccion", length: 50, nullable: true })
  direccion!: string;

  @OneToMany(() => Telefono, (telefono) => telefono.cliente, { cascade: true })
  telefonos!: Telefono[];
  
  @OneToOne(() => Usuario, (usuario) => usuario.cliente)
  usuario!: Usuario;

}

/*
CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    DNI VARCHAR(20) UNIQUE,
    Nombre TEXT,
    Direccion VARCHAR(50)
);
*/
