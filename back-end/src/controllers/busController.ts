import { Request, Response } from "express";
import { LineaService } from "../service/lineaService";
import { ParadaService } from "../service/paradaService";
import { UbicacionBusService } from "../service/ubicacionBusService";

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
      res.status(500).json({ success: false, message: "Error aldddd obtener paradas para la línea" });
    }
  }

  public static async importarCSV(req: Request, res: Response) {
    try {
      await UbicacionBusService.importarCSV();
      return res.json({ success: true, message: "CSV importado correctamente" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al importar CSV" });
    }
  }

  public static async generarUbicacionesAleatorias(req: Request, res: Response) {
    try {
      await UbicacionBusService.generarUbicacionesIniciales();
      return res.json({ success: true, message: "Ubicaciones aleatorias generadas correctamente" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al generar ubicaciones aleatorias" });
    }
  }

  public static async generarUbicacionBus(req: Request, res: Response) {
    try {
      const ubicaciones = await UbicacionBusService.actualizarUbicacionesEnTiempoReal();
      return res.json({ success: true, data: ubicaciones });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error al obtener ubicaciones de buses" });
    }
  }

}
