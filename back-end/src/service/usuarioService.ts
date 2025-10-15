import { DB } from "../config/typeorm";
import { Usuario } from "../entities/usuario";
import { Log } from "../entities/logs";
import CryptoJS from "crypto-js";

export class usuarioService {

    public static async getUsuarios() {
        try {
            const repo = DB.getRepository(Usuario);
            const usuarios = await repo.find();
            return usuarios;
        } catch (err) {
            console.error("Error en consumoService:", err);
            throw err;
        }
    }


    public static async addUsuario(data: Usuario) {
        try {
            const contraCifrada = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.Base64);
            data.password = contraCifrada;

            let result = await DB.getRepository(Usuario).save(data);

            console.log("Usuario añadido:", result);
            return result;
        } catch (err) {
            console.error("Error en usuarioService.addUsuario:", err);
            throw err;
        }
    }


    public static async login(data: Usuario) {
        try {
            const repo = DB.getRepository(Usuario);
            const user = await repo.findOneBy({ username: data.username });

            const log = new Log();
            log.usuario = user;

            if (!user) {
                throw new Error("Usuario no encontrado.");
            }

            const hashedPassword = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.Base64);
            if (hashedPassword !== user.password) {
                log.exito = false;
                await DB.getRepository(Log).save(log);
                throw new Error("Contraseña incorrecta.");
            }

            log.exito = true;
            await DB.getRepository(Log).save(log);

            return user;

        } catch (err) {
            console.error(err);
            throw err;
        }
    }

}