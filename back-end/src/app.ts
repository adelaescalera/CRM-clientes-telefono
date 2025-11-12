import { initOrm } from "./config/typeorm";
import express from "./config/express";
import "./config/scheduler";

import http from 'http'; 
import { Server } from "socket.io"
const server = new express();

const expressApp = server.app; 

const httpServer = http.createServer(expressApp); 

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

// io.on('connection', (socket) => {
//   socket.on('disconnect', () => {
//     console.log(`Socket desconectado: ${socket.id}`);
//   });
// });

const PORT = process.env.PORT || 3000;

const startApp = async () => {
  try {
    await initOrm();

    httpServer.listen(PORT, () => {
      console.log(`Servidor (con sockets) corriendo en http://localhost:${PORT} (app.ts)/`);
    });

  } catch (error) {
    console.error("Error al iniciar la app:", error);
  }
};

startApp();

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
