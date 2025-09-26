import { DataSource } from "typeorm"
import dotenv from "dotenv"
import configEnv from "./config"
import path from "path";
 
dotenv.config();
 
export const DB = new DataSource({
    type: "mysql",
    host: configEnv.db.host,
    port: configEnv.db.port,
    username: configEnv.db.user,
    password: configEnv.db.password,
    database: configEnv.db.database,
    entities: [path.join(__dirname, "../entities/*")],
    synchronize: true,
});
 
export const initOrm = async () => {
    try {
        console.log("Initializing ORM ");
        await DB.initialize();
        console.log(`ORM initialized ${configEnv.db.host}:${configEnv.db.port}`);
    }catch (error){
        console.log("ORM initialization failed");
        console.log(error);
    }
};
 