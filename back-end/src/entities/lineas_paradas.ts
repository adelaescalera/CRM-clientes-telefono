// lineaParada.entity.ts
import { Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "lineas_paradas" })
export class LineaParada {

  @PrimaryColumn()
  codLinea!: number;

  @PrimaryColumn()
  codParada!: number;
}
