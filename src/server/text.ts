// "dev": "ts-node-dev --respawn --transpile-only src/client/index.ts
// // package.json
// {
//   "name": "game",
//   "version": "1.0.0",
//   "type": "module",
//   "scripts": {
//     "dev": "ts-node-dev --respawn --transpile-only src/index.ts"
//   },
//   "dependencies": {
//     "express": "^5.1.0",
//     "socket.io": "^4.8.1"
//   },
//   "devDependencies": {
//     "@types/express": "^5.0.3",
//     "@types/node": "^24.2.0",
//     "ts-node-dev": "^2.0.0",
//     "typescript": "^5.9.2"
//   }
// }

// /*-------------------------------------------*/

// // tsconfig.json
// {
//   "compilerOptions": {
//     "target": "ES2022",
//     "module": "NodeNext",
//     "moduleResolution": "NodeNext",
//     "rootDir": "./src",
//     "outDir": "./dist",
//     "strict": true,
//     "esModuleInterop": true,
//     "skipLibCheck": true
//   },
//   "include": ["src/**/*"]
// }

// /*-------------------------------------------*/

// // src/index.ts
// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import path from "path";

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer);

// app.use(express.static(path.join(process.cwd(), "public")));

// io.on("connection", (socket) => {
//   console.log("Novo jogador conectado:", socket.id);

//   socket.on("playerMove", (data) => {
//     socket.broadcast.emit("playerMove", { id: socket.id, ...data });
//   });

//   socket.on("disconnect", () => {
//     console.log("Jogador desconectado:", socket.id);
//     socket.broadcast.emit("playerDisconnect", socket.id);
//   });
// });

// const PORT = 3000;
// httpServer.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
// });

// /*-------------------------------------------*/

// // public/index.html
// <!DOCTYPE html>
// <html lang="pt-BR">
// <head>
//   <meta charset="UTF-8" />
//   <title>Jogo Multiplayer Simples</title>
//   <style>
//     body { margin: 0; overflow: hidden; }
//     canvas { background: #222; display: block; margin: 0 auto; }
//   </style>
// </head>
// <body>
//   <canvas id="gameCanvas" width="800" height="400"></canvas>

//   <script src="/socket.io/socket.io.js"></script>
//   <script src="game.js"></script>
// </body>
// </html>

// /*-------------------------------------------*/

// // public/game.js
// const socket = io();

// const canvas = document.getElementById("gameCanvas");
// const ctx = canvas.getContext("2d");

// const players = {};

// const player = {
//   x: 50,
//   y: canvas.height / 2 - 25,
//   width: 10,
//   height: 50,
//   color: "lime",
//   speed: 5,
// };

// function drawPlayer(p) {
//   ctx.fillStyle = p.color;
//   ctx.fillRect(p.x, p.y, p.width, p.height);
// }

// function clear() {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// }

// window.addEventListener("keydown", (e) => {
//   if (e.key === "ArrowUp") {
//     player.y -= player.speed;
//     if (player.y < 0) player.y = 0;
//     sendMove();
//   } else if (e.key === "ArrowDown") {
//     player.y += player.speed;
//     if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
//     sendMove();
//   }
// });

// function sendMove() {
//   socket.emit("playerMove", { x: player.x, y: player.y });
// }

// socket.on("playerMove", (data) => {
//   players[data.id] = {
//     x: data.x,
//     y: data.y,
//     width: 10,
//     height: 50,
//     color: "red",
//   };
// });

// socket.on("playerDisconnect", (id) => {
//   delete players[id];
// });

// function gameLoop() {
//   clear();
//   drawPlayer(player);
//   for (const id in players) {
//     drawPlayer(players[id]);
//   }
//   requestAnimationFrame(gameLoop);
// }

// gameLoop();
