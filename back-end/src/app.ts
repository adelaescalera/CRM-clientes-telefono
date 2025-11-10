import { initOrm } from "./config/typeorm";
import express from "./config/express";
import "./config/scheduler";

// --- Imports de Sockets ---
import http from 'http'; // <-- NUEVO: Importa el módulo http de Node
import { Server } from "socket.io" // <-- NUEVO: Importa el Server de Socket.io

const server = new express();

// !--- PUNTO CLAVE ---!
// Asumo que tu clase 'express' (en config/express.ts)
// tiene una propiedad pública llamada 'app' que es la instancia de express.
// Si se llama de otra forma (ej: 'expressApp'), cámbialo aquí.
const expressApp = server.app; 

// --- Configuración de Socket.io ---
const httpServer = http.createServer(expressApp); // <-- NUEVO: Crea un servidor http

// <-- NUEVO: Inicia el servidor de Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200", // La URL de tu Angular
    methods: ["GET", "POST"]
  }
});

// <-- NUEVO: (Opcional) Log para ver conexiones
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log(`Socket desconectado: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;

const startApp = async () => {
  try {
    await initOrm();

    // ¡CAMBIO!
    // Ya no usamos server.start(), sino httpServer.listen()
    httpServer.listen(PORT, () => {
      console.log(`Servidor (con sockets) corriendo en http://localhost:${PORT} (app.ts)/`);
    });

  } catch (error) {
    console.error("Error al iniciar la app:", error);
  }
};

startApp();

// --- ¡VITAL! ---
// Exporta 'io' para que tu Scheduler pueda usarlo
export { io };


// import { initOrm} from "./config/typeorm";
// import express from "./config/express";
// import "./config/scheduler";

// const server = new express();


// const PORT = process.env.PORT || 3000;
// //const PORT=config.PORT || 3000;


// const startApp = async () => {
//   try {
    
//     await initOrm();

//     server.start(() => {
//       console.log(`Servidor corriendo en http://localhost:${PORT} (app.ts)/`);
//     });
//   } catch (error) {
//     console.error("Error al iniciar la app:", error);
//   }
// };

// startApp();
