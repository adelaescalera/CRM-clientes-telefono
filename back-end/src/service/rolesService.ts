import { DB } from "../config/typeorm";
import { Rol } from "../entities/roles";

export class rolesService {

    public static async getRoles() {
        try {
            const repo = DB.getRepository(Rol);
            const roles = await repo.find();
            return roles;
        } catch (err) {
            console.error("Error en consumoService:", err);
            throw err;
        }
    }


    public static async addRol(data: Rol) {
        try {
            let result = await DB.getRepository(Rol).save(data);
            console.log("Rol añadido:", result);
            return result;
        } catch (err) {
            console.error("Error en rolesService.addRol:", err);
            throw err;
        }
    }
}