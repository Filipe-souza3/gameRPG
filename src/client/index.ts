// import { server } from "../server/server";
import { io } from 'socket.io-client';

/*
ver sobre chunks
carregar objs conforme aparece na camera
colisoes com ambinte
minimapa, mundo mo limite

*/


export class index {

    socket = io("http://localhost:3000");

    //player
    name?: string;
    id?: string;

    //area
    dpr: number = window.devicePixelRatio || 1; //valor repsentante do pixel real
    steps: number = 1;
    canvas: HTMLCanvasElement = document.getElementById("area") as HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D;
    width: number = 0;
    height: number = 0;
    worldx: number = 0;
    worldy: number = 0;
    keys: any = {};
    keyCollision?: string;
    myPlayer: any = {
        size: 20,
        color: "red"
    }
    objects: any[] = [
        { x: 20, y: 10, size: 20, color: "green", img: "tree.gif" },
        { x: -150, y: 50, size: 55, color: "blue", img: "tree.gif" },
        { x: 300, y: -200, size: 80, color: "gray", img: "tree.gif" },
        { x: 100, y: 300, size: 130, color: "orange", img: "tree.gif" },
        { x: -200, y: -150, size: 10, color: "black", img: "tree.gif" },
    ];

    img = new Image();
            

    //keys
    delayKeyPress: number = 1000;
    lastKeyPress: number = 0;
    arrowKeys: any = {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight"
    }



    constructor() {
        this.addlisteners();
        this.createCanvas();
        this.resizeCanvas();
        this.initSocket();
        this.gameLoop();
    }


    createCanvas() {
        // let canvas = document.getElementById("area") as HTMLCanvasElement;
        // this.ctx = canvas.getContext("2d") || undefined;

        this.ctx = this.canvas.getContext("2d") || undefined;

    }

    resizeCanvas() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.canvas.style.width = this.width + "px";
        this.canvas.style.height = this.height + "px";
    }

    drawObjects() {
        // type GameObject = {
        // x: number;
        // y: number;
        // color: string;
        // };
// this.img.src = 'https://via.placeholder.com/200x150';
        this.ctx?.clearRect(0, 0, this.width, this.height);
        if (this.name) {
            this.createPlayer();
        }
        this.objects.forEach((obj) => {

            let screenX = obj.x - this.worldx;
            let screenY = obj.y - this.worldy;

            //            // Desenha só se estiver dentro do canvas
            // if (
            //   screenX + 32 < 0 || screenX > WIDTH ||
            //   screenY + 32 < 0 || screenY > HEIGHT
            // ) {
            //   continue;
            // }

            // let img = new Image();
            // img.src = 'https://via.placeholder.com/200x150';
            // img.src = './tree.gif';
            // this.img.onload = () => {

            //     this.ctx!.drawImage(this.img, screenX, screenY, obj.size, obj.size);


            //     this.ctx!.strokeStyle = 'black';
            //     this.ctx!.lineWidth = 2;
            //     this.ctx!.strokeRect(screenX, screenY,  obj.size,  obj.size);
            // }
            this.ctx!.fillStyle = obj.color;
            this.ctx!.fillRect(screenX, screenY, obj.size, obj.size);
        });
    }


    initSocket() {
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
        document.addEventListener("resize", this.resizeCanvas);
    }

    addListenersControls(id: string) {
        document.addEventListener("keydown", (event) => {
            console.log("key");
            let now = Date.now();
            if (now - this.lastKeyPress < this.delayKeyPress) { return; }
            this.keys[event.key] = true;
        });
        document.addEventListener("keyup", (event) => {
            this.keys[event.key] = false;
        });
    }

    collisionPlayer(key: string, futurePosition: number) {
        let left = 0, right = 0, up = 0, down = 0;
        if (key == this.arrowKeys.left) { left = futurePosition }
        if (key == this.arrowKeys.right) { right = futurePosition; }
        if (key == this.arrowKeys.up) { up = futurePosition; }
        if (key == this.arrowKeys.down) { down = futurePosition; }
        let halfPlayer = this.myPlayer.size / 2;

        return this.objects.some((e) => {

            if ((e.x - this.worldx) > 0 && (e.x - this.worldx) < this.width
                && (e.y - this.worldy) > 0 && (e.y - this.worldy) < this.height) {

                if (((e.x - this.worldx) + e.size + halfPlayer) >= ((this.width * this.dpr) / 2) - left
                    && (e.x - this.worldx) <= (((this.width * this.dpr) / 2) + halfPlayer + right)
                    && ((e.y - this.worldy) + e.size + halfPlayer) >= ((this.height * this.dpr) / 2) - up
                    && (e.y - this.worldy) <= (((this.height * this.dpr) / 2) + halfPlayer + down)) {

                    return true;
                }
            }
        });
    }

    movePlayer(id?: string, direction?: any) {
        if (Object.keys(this.keys).length > 0) {
            if (this.keys[this.arrowKeys.up] && !(this.collisionPlayer(this.arrowKeys.up, 1))) { this.worldy -= this.steps; }
            if (this.keys[this.arrowKeys.left] && !(this.collisionPlayer(this.arrowKeys.left, 1))) { this.worldx -= this.steps; }
            if (this.keys[this.arrowKeys.down] && !this.collisionPlayer(this.arrowKeys.down, 1)) { this.worldy += this.steps; }
            if (this.keys[this.arrowKeys.right] && !this.collisionPlayer(this.arrowKeys.right, 1)) { this.worldx += this.steps; }
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

    createPlayer(id?: string) {
        if (this.ctx) {
            this.ctx.fillStyle = "red";
            // this.ctx.fillRect((this.width / 2 - 10), (this.height / 2 - 10), 20, 15);
            this.ctx.fillRect(((this.width * this.dpr) / 2) - (this.myPlayer.size / 2), ((this.height * this.dpr) / 2) - (this.myPlayer.size / 2), this.myPlayer.size, this.myPlayer.size);
        }


        // let p = document.createElement("div");
        // p.style.width = "20px";
        // p.style.height = "20px";
        // p.style.backgroundColor = "red";
        // p.style.position = "absolute";
        // p.id = id;
        // document.getElementById("area")?.appendChild(p);
    }

    log(message: string) {
        let li = document.createElement("li");
        li.textContent = message;
        document.getElementById("logs")?.appendChild(li);
    }

    private gameLoop = () => {
        this.movePlayer();
        this.drawObjects();
        // this.initSocket();
        // this.addlisteners();
        requestAnimationFrame(this.gameLoop);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const i = new index();



});