// linea.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";


@Entity({ name: "linea" })
export class Linea {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "codLinea",type:"int", unique:true})
  codLinea!: number;

  @Column({ name: "nombreLinea", type: "varchar",length:200 })
  nombreLinea!: string;

  @Column({ name: "cabeceraIda", type: "varchar",length:200,nullable: true })
  cabeceraIda!: string;

  @Column({ name: "cabeceraVuelta", type: "varchar",length:200, nullable: true})
  cabeceraVuelta!: string;
}
