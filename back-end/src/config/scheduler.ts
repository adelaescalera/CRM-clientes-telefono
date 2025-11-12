import schedule from 'node-schedule';
import { LineaService } from '../service/lineaService';
import {UbicacionBusService} from "../service/ubicacionBusService";


//Ejecutar la tarea cada día a las 2:00 AM
schedule.scheduleJob('0 2 * * *', async () => {
    try {
        await LineaService.fetchLineas();
        console.log('Tarea programada: Actualización de líneas completada exitosamente.');
    } catch (error) {
        console.error('Error en la tarea programada de actualización de líneas:', error);
    }
});

//Ejecutar la tarea cada 45 minutos
schedule.scheduleJob('*/8 * * * *', async () => {
    try {
        let ahora=new Date();
        await UbicacionBusService.fetchUbicacionBus();
        console.log('Tarea programada: Actualización de ubicaciones completada exitosamente a las ',ahora.getHours()+ ':'+ahora.getMinutes() );
    } catch (error) {
        console.error('Error en la tarea programada de actualización de ubicaciones:', error);
    }
});