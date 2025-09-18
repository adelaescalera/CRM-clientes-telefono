import config from './config';
import express, { Request, Response } from 'express';
//import cors from 'cors';
import indexRoutes from '../routes/general/indexRoutes';
/**
 * EXPRESS es el framework que usamos para construir la API y los servidores web
 */
export default class Server {
    public app: express.Application;
    public port: number;

    constructor() {
        this.app = express();
        this.port = config.PORT;

        // Middlewares básicos
        this.app.use(express.json()); // Enviar json
        //this.app.use(cors()); // Sincronización front

        // Rutas principales obtención de endpoints
        this.app.use('/api', indexRoutes);

        // Ruta raíz obtención de respuestas-verdaderamente innecesario
        this.app.get('/', (_req: Request, res: Response) => {
            res.send('Express + TypeScript Server');
        });

        // Carpeta de assets (si se usan)
        // this.app.use('/assets', express.static(path.join(__dirname, '../../assets')));
    }

    public start(callback: () => void): void {
        this.app.listen(this.port, callback);
        console.log(`Servidor corriendo en http://localhost:${this.port}/`);
    }
}