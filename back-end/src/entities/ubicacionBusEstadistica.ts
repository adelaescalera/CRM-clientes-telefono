import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";

@Entity({ name: "UbicacionBusEstadistica" })
export class UbicacionBusEstadistica {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "codBus", type: "int" })
  codBus!: number;

  @Column({ name: "codLinea", type: "int" })
  codLinea!: number;

  // sentido:1= ida, 2 = vuelta
  @Column({ name: "sentido", type: "numeric", nullable: true })
  sentido!: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  lat!: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  lon!: number;

  @Column("timestamp", { name: "fecha", default: () => "CURRENT_TIMESTAMP" })
  fecha!: Date;
}
