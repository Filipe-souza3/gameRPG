import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import cors from 'cors';

export class server {

    app = express().use(cors());
    httpServer = createServer(this.app);
    io = new Server(this.httpServer, {
        cors: {
            origin: '*',
            credentials: false  // permite todas as origens
            //     methods: ['GET', 'POST'],
            //     credentials: false // com origin '*', credentials precisa ser false
        }
    });

    constructor() {
        console.log("criando end point");

        // this.app.use(express.static(path.join(__dirname,"src/")));
        // this.app.get("/", (req, res)=>{
        //     res.sendFile(path.join(__dirname, '../client/index.html'));
        // });

        // this.app.use(express.static(path.join(process.cwd(), "../public")));
    }

    init() {
        console.log("iniciando conexao server");

        this.io.on("connection", (socket) => {
            console.log("novo jogar conectado", socket.id);
            socket.emit("newPlayerId", { id: socket.id });

            socket.on("playerJoin", (data) => {
                console.log("jogador entrou", socket.id);
                console.log(data);
                socket.broadcast.emit("playerJoin", { nome: data });
            });

            socket.on("createPlayer", (data) => {
                console.log("player criado "+data.id);
                socket.broadcast.emit("createPlayer", { id: data.id });
            });

            socket.on("movePlayer", (data) => {
                console.log(data);
                socket.broadcast.emit("movePlayer", {id:data.id, direction:data.direction});
            });

            socket.on("playerAction", (data) => {
                console.log("Acao jogador", socket.id);
                socket.broadcast.emit("playerAction", { acao: data });
            });

            socket.on("discconect", () => {
                console.log("jogador desconectado", socket.id);
                socket.broadcast.emit("playerDisconnect", socket.id);
            });
        });
    }


    listen() {
        const port = 3000;
        this.httpServer.listen(port, () => {
            console.log(`Servidor rodando na porta${port}`);

        });
    }
}

const s = new server();
s.init();
s.listen();



/*
Apenas o cliente atual	socket.emit("evento", dados)
Todos os clientes	io.emit("evento", dados)
Todos, exceto o atual	socket.broadcast.emit("evento", dados)
Grupo específico (sala)	io.to("sala").emit("evento", dados)
Jogador por ID de socket	io.to(socketId).emit("evento", dados)
*/