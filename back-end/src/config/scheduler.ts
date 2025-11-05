import schedule from 'node-schedule';
import { LineaService } from '../service/lineaService';
// import {UbicacionService} from "../service/ubicacionService";

//Ejecutar la tarea cada día a las 2:00 AM
schedule.scheduleJob('0 2 * * *', async () => {
    try {
        await LineaService.fetchLineas();
        console.log('Tarea programada: Actualización de líneas completada exitosamente.');
    } catch (error) {
        console.error('Error en la tarea programada de actualización de líneas:', error);
    }
});


// //Ejecutar la tarea cada 45 minutos
// schedule.scheduleJob('*/1 * * * *', async () => {
//     try {
//         await UbicacionService.fetchUbicaciones();
//         console.log('Tarea programada: Actualización de ubicaciones completada exitosamente.');
//     } catch (error) {
//         console.error('Error en la tarea programada de actualización de ubicaciones:', error);
//     }
// });