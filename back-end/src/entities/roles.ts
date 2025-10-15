import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Usuario } from "./usuario";

@Entity({name:"roles"})
export class Rol {

  @PrimaryGeneratedColumn({ name: "id_rol", type: "int" })
  id!: number;

  @Column("varchar", { name: "tipo", length: 20, unique: true })
  tipo!: string;

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios!: Usuario[];
}


/*
CREATE TABLE roles (
    id_rol INT PRIMARY KEY,
    tipo VARCHAR(20) UNIQUE
);
*/
