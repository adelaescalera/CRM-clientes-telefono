import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Telefono } from "./telefono";

@Entity("consumo")
export class Consumo {
    // Clave primaria autoincrement
    @PrimaryGeneratedColumn({ name: "consumo_id", type: "int" })
    id!: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    consumo!: number;

    @Column({ type: 'int', nullable: false })
    mes!: number;

    @Column({ type: 'int', nullable: false })
    anio!: number;


    @ManyToOne(() => Telefono, (telefono) => telefono.consumo, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })

    @JoinColumn({ name: "phone_id" }) // clave externa
    telefono!: Telefono;
}

/*
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

*/