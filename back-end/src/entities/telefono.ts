import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Cliente } from "./cliente";
import { Consumo } from "./consumo";

@Entity({name:"telefono"})
export class Telefono {
  // Clave primaria autoincrement
  @PrimaryGeneratedColumn({ name: "phone_id", type: "int" })
  phoneId!: number;

  @Column("varchar", { name: "numero", length: 20, unique: true })
  numero!: string;

  @Column("enum", { name: "type", enum: ["mobile", "landline", "office"] })
  type!: "mobile" | "landline" | "office";


  @Column("timestamp", { name: "fecha", default: () => "CURRENT_TIMESTAMP" })
  fecha!: Date;

  @ManyToOne(() => Cliente, (cliente) => cliente.telefonos, {
    nullable: true,       // permite que id_cliente sea NULL
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "id_cliente" }) // clave externa
  cliente!: Cliente | null;

  @OneToMany(() => Consumo, (consumo) => consumo.telefono, { cascade: true })
  consumo!: Consumo[];
}

/*
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
*/