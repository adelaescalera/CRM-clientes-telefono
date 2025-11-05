import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";

@Entity({ name: "ubicacion_bus" })
export class UbicacionBus {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "codBus", type: "int"})
  codBus!: number;

  @Column({ name: "codLinea", type: "int" })
  codLinea!: number;

  // sentido:1= ida, 2 = vuelta
  @Column({ name: "sentido", type: "numeric", nullable: true })
  sentido!: number;

  @Column({ name: "lon", type: "numeric"})
  lon!: number;

  @Column({ name: "lat", type: "numeric" })
  lat!: number;
}
