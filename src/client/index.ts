// import { server } from "../server/server";
import { io } from 'socket.io-client';
import { trees } from './objects/trees'
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
    steps: number = 5; //velocidade
    marginCollision: number = 5;
    canvasArea: HTMLCanvasElement = document.getElementById("area") as HTMLCanvasElement;
    canvasObjects: HTMLCanvasElement = document.getElementById("objects") as HTMLCanvasElement;
    ctxArea?: CanvasRenderingContext2D;
    ctxObjects?: CanvasRenderingContext2D;
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
    ground: any = { x: 0, y: 0, sizex: 0, sizey: 0, img: "grass.jpg" };
    groundx: number = 0;
    groundy: number = 0;
    objects: any[] = [
        { x: 100, y: 300, size: 130, color: "orange", img: "tree.webp" },
        { x: 300, y: -200, size: 80, color: "gray", img: "tree3.png" },
        { x: 20, y: 10, size: 40, color: "green", img: "tree4.png" },
        { x: -150, y: 50, size: 55, color: "blue", img: "tree2.png" },
        { x: -200, y: -150, size: 100, color: "black", img: "tree1.png" },
    ];



    //keys
    delayKeyPress: number = 0;
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

        this.ctxObjects = this.canvasObjects.getContext("2d") || undefined;
        this.ctxArea = this.canvasArea.getContext("2d") || undefined;
        // this.ctxObjects!.fillStyle = "green";

    }

    resizeCanvas() {
        let allCanvas = document.getElementById("all-canvas") as HTMLDivElement;
        //area
        // this.width = this.canvasObjects.clientWidth;
        // this.height = this.canvasObjects.clientHeight;
        // this.canvasObjects.width = this.width * this.dpr;
        // this.canvasObjects.height = this.height * this.dpr;
        // this.canvasObjects.style.width = this.width + "px";
        // // this.canvasObjects.style.height = this.height + "px";
        // this.canvasObjects.style.height = "900px";

        //objects
        this.width = allCanvas.clientWidth;
        this.height = allCanvas.clientHeight;
        // this.width = this.canvasObjects.clientWidth;
        // this.height = this.canvasObjects.clientHeight;
        this.canvasObjects.width = this.width * this.dpr;
        this.canvasObjects.height = this.height * this.dpr;
        this.canvasObjects.style.width = this.width + "px";
        // this.canvasObjects.style.height = this.height + "px";
        this.canvasObjects.style.height = "900px";

        this.ground.sizex = this.width;
        this.ground.sizey = this.height;

        //para fazer o chao carregar ao andar
        this.groundx = this.ground.x;
        this.groundy = this.ground.y;
    }


    drawObjects() {

        this.ctxObjects?.clearRect(0, 0, this.width, this.height);

        this.drawGround();

        if (this.name) {
            this.createPlayer();
        }
        trees.forEach((obj) => {

            if ((obj.x - this.worldx) > ((obj.size * 0.8) * (-1)) && (obj.x - this.worldx) < this.width
                && (obj.y - this.worldy) > ((obj.size * 0.8) * (-1)) && (obj.y - this.worldy) < this.height) {


                let screenX = obj.x - this.worldx;
                let screenY = obj.y - this.worldy;

                this.drawTrees(obj, screenX, screenY);

                // }
                // this.ctx!.fillStyle = obj.color;
                // this.ctx!.fillRect(screenX, screenY, obj.size, obj.size);
            }
        });


    }

    drawTrees(tree: any, screenX: number, screenY: number) {
        let trees = new Image();
        trees.src = './imgs/' + tree.img;
        this.ctxObjects!.drawImage(trees, screenX, screenY, tree.size, tree.size);


        this.ctxObjects!.strokeStyle = 'black';
        this.ctxObjects!.lineWidth = 1;
        this.ctxObjects!.strokeRect(screenX, screenY, tree.size, tree.size);
    }

    drawGround() {
        let ground = new Image();
        ground.src = './imgs/' + this.ground.img;

        //center
        this.ctxObjects!.drawImage(ground, this.groundx - this.worldx, this.groundy - this.worldy, this.width, this.height);
        //left
        this.ctxObjects!.drawImage(ground, (this.groundx - this.width) - this.worldx, this.groundy - this.worldy, this.width, this.height);
        //right
        this.ctxObjects!.drawImage(ground, (this.groundx + this.width) - this.worldx, this.groundy - this.worldy, this.width, this.height);
        //up
        this.ctxObjects!.drawImage(ground, this.groundx - this.worldx, (this.groundy - this.height) - this.worldy, this.width, this.height);
        //down
        this.ctxObjects!.drawImage(ground, this.groundx - this.worldx, (this.groundy + this.height) - this.worldy, this.width, this.height);
        //top left
        this.ctxObjects!.drawImage(ground, (this.groundx- this.width) - this.worldx, (this.groundy - this.height) - this.worldy, this.width, this.height);

        if (this.groundx > (this.worldx)) {
            this.groundx = this.groundx - this.width;
        }
        if(this.groundx < (this.worldx)){
            this.groundx = this.groundx + this.width;
        }
        if(this.groundy > (this.worldy)){
            this.groundy = this.groundy - this.height;
        }
        if(this.groundy < (this.worldy)){
            this.groundy = this.groundy + this.height;
        }
    }

    collisionPlayer(key: string, futurePosition: number) {
        let left = 0, right = 0, up = 0, down = 0;
        if (key == this.arrowKeys.left) { left = futurePosition }
        if (key == this.arrowKeys.right) { right = futurePosition; }
        if (key == this.arrowKeys.up) { up = futurePosition; }
        if (key == this.arrowKeys.down) { down = futurePosition; }
        let halfPlayer = this.myPlayer.size / 2;

        return trees.some((e) => {

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



    movePlayer(id?: string, direction?: any) {
        if (Object.keys(this.keys).length > 0) {
            if (this.keys[this.arrowKeys.up] && !(this.collisionPlayer(this.arrowKeys.up, this.marginCollision))) { this.worldy -= this.steps; }
            if (this.keys[this.arrowKeys.left] && !(this.collisionPlayer(this.arrowKeys.left, this.marginCollision))) { this.worldx -= this.steps; }
            if (this.keys[this.arrowKeys.down] && !this.collisionPlayer(this.arrowKeys.down, this.marginCollision)) { this.worldy += this.steps; }
            if (this.keys[this.arrowKeys.right] && !this.collisionPlayer(this.arrowKeys.right, this.marginCollision)) { this.worldx += this.steps; }
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
        if (this.ctxObjects) {
            this.ctxObjects.fillStyle = "red";
            // this.ctx.fillRect((this.width / 2 - 10), (this.height / 2 - 10), 20, 15);
            this.ctxObjects.fillRect(((this.width * this.dpr) / 2) - (this.myPlayer.size / 2), ((this.height * this.dpr) / 2) - (this.myPlayer.size / 2), this.myPlayer.size, this.myPlayer.size);
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