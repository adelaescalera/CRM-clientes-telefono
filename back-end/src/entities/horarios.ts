import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: "horarios" })
export class Horarios {
    @PrimaryGeneratedColumn({ name: "id" })
    id!: number;
    
    // columna route_id de trips.csv
    @Column({ name: "codLinea", type: "smallint", unsigned: true })
    codLinea!: number;
    
    // columna stop_id de stop_times.csv
    @Column({ name: "codParada", type: "smallint", unsigned: true })
    codParada!: number;
    
    @Column({ type: "smallint", unsigned: true })
    stopSequence!: number;
}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
//
// Para relacionar los 2 csv, hacedlo con trip_id leyendo los 2 csv
//
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------