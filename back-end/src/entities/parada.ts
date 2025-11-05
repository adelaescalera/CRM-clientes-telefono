// parada.entity.ts
import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity({ name: "parada" })
export class Parada {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "codParada", type: "int",unique:true })
  codParada!: number;

  @Column({ name: "nombreParada", type: "varchar", length: 200 })
  nombreParada!: string;

  @Column({ name: "direccion", type: "varchar", length: 400, nullable: true })
  direccion!: string;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  lat!: number;

  @Column({ type: "decimal", precision: 10, scale: 6 })
  lon!: number;

}
