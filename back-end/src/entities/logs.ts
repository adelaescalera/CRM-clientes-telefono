import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { Usuario } from "./usuario";

@Entity({ name: "logs" })
export class Log {

    @PrimaryGeneratedColumn({ name: "id_log", type: "int" })
    id!: number;

    // Relación con Usuario
    @ManyToOne(() => Usuario, (usuario) => usuario.logs, { onDelete: "SET NULL", onUpdate: "CASCADE" })
    @JoinColumn({ name: "id_usuario", referencedColumnName: "id" })
    usuario!: Usuario | null;

    @CreateDateColumn({ name: "fecha", type: "timestamp" })
    fecha!: Date;


    // Éxito del log
    @Column("boolean", { name: "exito" })
    exito!: boolean;
}


/*
CREATE TABLE logs (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    exito BOOLEAN,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
        ON UPDATE CASCADE
        ON DELETE SET NULL  
    
)
*/