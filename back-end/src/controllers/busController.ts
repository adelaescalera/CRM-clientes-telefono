import { Request, Response } from "express";
import { LineaService } from "../service/lineaService";
import { ParadaService } from "../service/paradaService";
import { UbicacionBusService } from "../service/ubicacionBusService";
import { HorarioService } from "../service/horarioService";

export class BusController {

  public static async getLineas(req: Request, res: Response) {
    try {
      const data = await LineaService.getLineas();
      return res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener líneas" });
    }
  }

  public static async saveBaseDatosLineas(req: Request, res: Response) {
    try {
      const data = await LineaService.fetchLineas();

      return res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener líneas" });
    }
  }

  public static async getParadasByLinea(req: Request, res: Response) {
    const codLinea = Number(req.params.codLinea);
    try {
      const paradas = await ParadaService.getParadasLinea(codLinea);
      return res.json({ success: true, data: paradas });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener paradas para la línea" });
    }
  }

  public static async importarCSV(req: Request, res: Response) {
    try {
      await HorarioService.importarCSV();
      return res.json({ success: true, message: "CSV importado correctamente" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al importar CSV" });
    }
  }

  public static async actualizarUbicacionBuses(req: Request, res: Response) {
    try {
      const data = await UbicacionBusService.fetchUbicacionBus();
      return res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al actualizar ubicación de buses" });
    }
  }

  public static async getTiempoLlegada(req: Request, res: Response) {
    try {
      const codL = Number(req.params.codLinea);
      const codP = Number(req.params.codParada);
      const data = await HorarioService.getTiempoLLegada(codL, codP);
      return res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al actualizar ubicación de buses" });
    }
  }


  public static async getUbicacionBuses(req: Request, res: Response) {
    try {
      const codL = Number(req.params.codLinea);
      if (isNaN(codL)) {
        return res.status(400).json({ success: false, message: "El codLinea debe ser un número" });
      }
      const data = await UbicacionBusService.getUbiDeBuses(codL);
      return res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener ubicación de buses" });
    }
  }

}
