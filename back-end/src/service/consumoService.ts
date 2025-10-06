import { DB } from "../config/typeorm";
import { Consumo } from "../entities/consumo";
import { Telefono } from "../entities/telefono";

export class consumoService {

    public static async getAllConsumos() {
        try {
            const repo = DB.getRepository(Consumo);
            const consumos = await repo.find();
            return consumos;
        } catch (err) {
            console.error("Error en consumoService:", err);
            throw err;
        }
    }

    public static async getAnual(phoneId: number) {
        try {
            return await DB.getRepository(Consumo)
                .createQueryBuilder('consumo')
                .select('consumo.phone_id', 'telefono')
                .addSelect('consumo.anio', 'anio')
                .addSelect('SUM(consumo.consumo)', 'total_anual')
                .where('consumo.phone_id = :phoneId', { phoneId })
                .groupBy('consumo.phone_id')
                .addGroupBy('consumo.anio')
                .orderBy('consumo.anio', 'ASC')
                .getRawMany();
        } catch (err) {
            console.error("Error en consumoService:", err);
            throw err;
        }
    }

public static async getConsumo(phoneId: number) {
  try {
    return await DB.getRepository(Consumo)
      .createQueryBuilder('consumo')
      .select('consumo.id', 'id') 
      .addSelect('consumo.phone_id', 'telefono')
      .addSelect('consumo.anio', 'anio')
      .addSelect('consumo.mes', 'mes')
      .addSelect('SUM(consumo.consumo)', 'total_mensual')
      .where('consumo.phone_id = :phoneId', { phoneId })
      .groupBy('consumo.id') 
      .addGroupBy('consumo.phone_id')
      .addGroupBy('consumo.anio')
      .addGroupBy('consumo.mes')
      .orderBy('consumo.anio', 'ASC')
      .addOrderBy('consumo.mes', 'ASC')
      .getRawMany();
  } catch (err) {
    console.error("Error en consumoService:", err);
    throw err;
  }
}



    public static async addConsumo(data: any) {
        try {
            const repoConsumo = DB.getRepository(Consumo);
            const repoTelefono = DB.getRepository(Telefono);

            // Buscar el teléfono correspondiente
            const telefonoDado = await repoTelefono.findOne({ where: { phoneId: data.phone_id } });
            if (!telefonoDado) throw new Error("Teléfono no encontrado");

            // Crear la entidad Consumo
            const nuevoConsumo = repoConsumo.create({
                consumo: data.consumo,
                mes: data.mes,
                anio: data.anio,
                telefono: telefonoDado
            });

            const result = await repoConsumo.save(nuevoConsumo);
            console.log("Consumo añadido:", result);
            return result;

        } catch (err) {
            console.error("Error en consumoService:", err);
            throw err;
        }
    }

    public static async deleteConsumo(id: number): Promise<void> {
        const consumoRepo = DB.getRepository(Consumo);

        const consumo = await consumoRepo.findOneBy({ id });
        if (!consumo) {
            throw new Error(`Consumo con id ${id} no encontrado`);
        }

        await consumoRepo.remove(consumo);
    }

    public static async updateConsumo(idDado: number, data: any) {
        const consumoRepo = DB.getRepository(Consumo);
        const telefonoRepo = DB.getRepository(Telefono);

        // Buscar el consumo existente con su relación a telefono
        const consumo = await consumoRepo.findOne({
            where: { id: idDado },
            relations: ["telefono"]
        });

        if (!consumo) throw new Error("Consumo no encontrado");

        // Actualizar los campos simples
        consumo.consumo = data.consumo ?? consumo.consumo;
        consumo.mes = data.mes ?? consumo.mes;
        consumo.anio = data.anio ?? consumo.anio;

        // Si nos pasan phone_id para actualizar la relación
        if (data.phone_id) {
            const telefono = await telefonoRepo.findOne({ where: { phoneId: data.phone_id } });
            if (!telefono) throw new Error("Teléfono no encontrado");
            consumo.telefono = telefono;
        }

        // Guardar los cambios
        const updated = await consumoRepo.save(consumo);

        // Retornar objeto para el controller
        return {
            consumoId: updated.id,
            consumo: updated.consumo,
            mes: updated.mes,
            anio: updated.anio,
            phone_id: updated.telefono?.phoneId ?? null
        };
    }

}