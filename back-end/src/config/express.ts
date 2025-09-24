import config from './config';
import cors from 'cors';
import express, { Request, Response } from 'express';
import indexRoutes from '../routes/indexRoutes';
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
        // Sincronización front
        this.app.use(cors({
            origin: 'http://localhost:4200',
        }));
        

        // Rutas principales obtención de endpoints
        this.app.use('/api', indexRoutes);

        // Carpeta de assets (si se usan)
        // this.app.use('/assets', express.static(path.join(__dirname, '../../assets')));
    }

    public start(callback: () => void): void {
        this.app.listen(this.port, callback);
        console.log(`Servidor corriendo en http://localhost:${this.port} (express)/`);
    }
}