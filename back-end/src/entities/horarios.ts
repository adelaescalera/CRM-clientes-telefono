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
    // columa arrival_time de stop_times.csv
    //
    // To determine when the next bus arrives at a stop, I will use the current time 
    // with new Date(), calculate the difference with this attribute, 
    // and keep the smallest possible time difference.
    @Column({ name: "tiempoLlegada", type: "time", nullable: true })
    tiempoLlegada!: string;
}

// -----------------------------------------------------------------------
// -----------------------------------------------------------------------
//
// Para relacionar los 2 csv, hacedlo con trip_id leyendo los 2 csv
//
// -----------------------------------------------------------------------
// -----------------------------------------------------------------------