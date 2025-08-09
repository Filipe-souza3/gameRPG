import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import path from "path";
import { log } from "console";

export class server {

    app = express();
    httpServer = createServer(this.app);
    io = new Server(this.httpServer, {
  cors: {
    origin: "*"
  }
});

    constructor() {
        console.log("criando end point");
        
        this.app.use(express.static(path.join(__dirname,"../../public")));
        this.app.get("/", (req, res)=>{
            res.sendFile(path.join(__dirname, '../../public/index.html'));
        });
        this.listen();
        // this.app.use(express.static(path.join(process.cwd(), "../public")));
    }

    init() {
        console.log("iniciando conexao server");

        this.io.on("connection", (socket: Socket)=>{
            console.log("novo jogar conectado", socket.id);

            socket.on("playerAction", (data)=>{
                console.log("acao jogador", socket.id);
                socket.broadcast.emit("updateAction", {...data});
            });

            socket.on("discconect", ()=>{
                console.log("jogador desconectado", socket.id);
                socket.broadcast.emit("playerDisconnect", socket.id);
            });            
        });
    }


    listen(){
        const port = 3000;
        this.httpServer.listen(port, ()=>{
            console.log(`Servidor rodando na porta${port}`);
            
        });
    }
}