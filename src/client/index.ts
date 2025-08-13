// import { server } from "../server/server";
import { io } from 'socket.io-client';




export class index {

    socket = io("http://localhost:3000");
    name?: string;
    id?: string;

    init() {
        // let s = new server();
        // // s.listen();
        // s.init();
        console.log("iniciou client");

        this.socket.on('connection', (name: string) => {
            this.log(`${name} conectou`);
        });

        this.socket.on('newPlayerId', (data) => {
            this.setIdPlayer(data.id);
            this.log(`seu codigo ${data.id}`);
        });

        this.socket.on('playerJoin', (data: any) => {
            this.log(`jogador ${data.nome} entrou`);
        });

        this.socket.on('createPlayer', (data: any) => {
            console.log(data);
            this.createPlayer(data.id);
        });

        this.socket.on('movePlayer', (data: any) => {
            this.movePlayer(data.id, data.direction);
        });


        this.socket.on('playerAction', (data: any) => {
            this.log(data.acao);
        });


    }

    addlisteners() {
        document.getElementById("join")?.addEventListener("click", () => this.joinGame());
        document.getElementById("action")?.addEventListener("click", () => this.sendAction());
    }

    addListenersControls(id: string) {
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "ArrowUp":
                    this.movePlayer(this.id!, "up");
                    break;
                case "ArrowDown":
                    this.movePlayer(this.id!, "down");
                    break;
                case "ArrowLeft":
                    this.movePlayer(this.id!, "left");
                    break;
                case "ArrowRight":
                    this.movePlayer(this.id!, "right");
                    break;
            }
        });
    }

    movePlayer(id: string, direction: string) {
        let player = document.getElementById(id);
        let top = parseInt(player!.style.top) || 0;
        let left = parseInt(player!.style.left) || 0;
        switch (direction) {
            case "up":
                if (id == this.id) this.socket.emit("movePlayer", { id: id, direction: "up" });
                player!.style.top = top - 10 + "px";
                break;
            case "down":
                if (id == this.id) this.socket.emit("movePlayer", { id: id, direction: "down" });
                player!.style.top = top + 10 + "px";
                break;
            case "left":
                if (id == this.id) this.socket.emit("movePlayer", { id: id, direction: "left" });
                player!.style.left = left - 10 + "px";
                break;
            case "right":
                if (id == this.id) this.socket.emit("movePlayer", { id: id, direction: "right" });
                player!.style.left = left + 10 + "px";
                break;
        }
    }

    joinGame() {
        if (this.id) {
            let input = document.getElementById("name") as HTMLInputElement;
            this.name = input.value;
            this.socket.emit("playerJoin", this.name);
            this.log(`voce entrou como ${this.name}`);
            this.createPlayer(this.id);
            this.socket.emit("createPlayer", { id: this.id });
            this.addListenersControls(this.id);
        }
    }

    setIdPlayer(id: string) {
        this.id = id;
    }

    sendAction() {
        this.socket.emit("playerAction", `${this.name} fez uma acao`);
    }


    log(message: string) {
        let li = document.createElement("li");
        li.textContent = message;
        document.getElementById("logs")?.appendChild(li);
    }

    createPlayer(id: string) {
        let p = document.createElement("div");
        p.style.width = "20px";
        p.style.height = "20px";
        p.style.backgroundColor = "red";
        p.style.position = "absolute";
        p.id = id;
        document.getElementById("content")?.appendChild(p);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const i = new index();
    i.init();
    i.addlisteners();

});