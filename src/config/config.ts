//leer archivo env
//ver variabls 
import dotenv from "dotenv";
import db from "../db";
import { env } from "process";
const Joi = require("joi");

//Cargar variables de entorno desde .env
const confi = dotenv.config({ path: './.env' });
if (confi.error) {
    throw new Error("No se pudo cargar el archivo .env");
}

// Validar las variables de entorno
const envSchema = Joi.object({
    DB_HOST: Joi.string().required(),
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_NAME: Joi.string().required(),
    DB_PORT: Joi.number().default(3306),
}).unknown().required();

const { error, value } = envSchema.validate(process.env);
if (error) {
    throw new Error(`Error en la configuración de las variables de entorno: ${error.message}`);
}

// Exportar la configuración validada
const configEnv = {
    PORT: value.PORT,  //de momento no usado porque express usa 3000 por defecto
    db: {
        host: value.DB_HOST,
        user: value.DB_USER,
        password: value.DB_PASSWORD,
        database: value.DB_NAME,
        port: value.DB_PORT,
    },
};

export default configEnv;