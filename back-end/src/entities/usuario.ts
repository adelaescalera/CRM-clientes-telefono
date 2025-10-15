import { Entity, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { Cliente } from "./cliente";
import { Rol } from "./roles";
import { Log } from "./logs";

@Entity({ name: "usuario" })
export class Usuario {

   @PrimaryGeneratedColumn({ name: "id_usuario", type: "int" })
   id!: number;

   @OneToOne(() => Cliente, { onDelete: "CASCADE", onUpdate: "CASCADE", nullable: true })
   @JoinColumn({ name: "DNI", referencedColumnName: "dni" })
   cliente!: Cliente | null;


   @Column("varchar", { name: "username", length: 20, unique: true })
   username!: string;

   @Column("varchar", { name: "password", length: 64 })
   password!: string;


   // Relación ManyToOne con Rol
   @ManyToOne(() => Rol, (rol) => rol.usuarios, { onDelete: "CASCADE", onUpdate: "CASCADE" })
   @JoinColumn({ name: "rol", referencedColumnName: "id" })
   rol!: Rol;

   // Relación con logs
   @OneToMany(() => Log, (log) => log.usuario)
   logs!: Log[];
}



/*
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    DNI VARCHAR(20) UNIQUE NULL,
    username VARCHAR(20) UNIQUE,
    password VARCHAR(64),
    rol INT,
     FOREIGN KEY (DNI) REFERENCES cliente(DNI)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
     FOREIGN KEY (rol) REFERENCES roles(id_rol)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
*/
