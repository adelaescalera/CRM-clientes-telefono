import { DataSource } from "typeorm"
import dotenv from "dotenv"
//import path from "path"
import { Cliente } from "../entities/cliente";
import { Telefono } from "../entities/telefono";

import configEnv from "./config"
 
dotenv.config();
 
export const DB = new DataSource({
    type: "mysql",
    host: configEnv.db.host,
    port: configEnv.db.port,
    username: configEnv.db.user,
    password: configEnv.db.password,
    database: configEnv.db.database,
    entities: [Cliente, Telefono],
    //entities: [path.join(__dirname, "../entities/*")],
    synchronize: true,
});
 
export const initOrm = async () => {
    try {
        console.log("[orm]: Initializing ORM ");
        await DB.initialize();
        console.log(`[orm]: ORM initialized ${configEnv.db.host}:${configEnv.db.port}`);
    }catch (error){
        console.log("[orm]: ORM initialization failed");
        console.log(error);
    }
};
 