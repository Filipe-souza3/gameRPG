// import { server } from "../server/server";
import { io } from 'socket.io-client';
import { Trees } from './objects/trees';
// import { magicFieldBlue, frameFieldBlue } from './objects/others';
import { timeLog } from 'console';
import { Minotaur } from './objects/minotaur';
import { Player } from './objects/player';
import { MagicBlueField } from './objects/magicBlueField'
import { Ground } from './objects/ground';

/*
ver sobre chunks
carregar objs conforme aparece na camera
colisoes com ambinte
minimapa, mundo mo limite

*/


export class index {

    socket = io("http://localhost:3000");

    scale: number = 64;

    //images
    minotaurImage = new Image();
    playerImage = new Image();
    magicBlueFieldImage = new Image();

    //player
    name?: string;
    id?: string;

    //area
    dpr: number = window.devicePixelRatio || 1; //valor repsentante do pixel real
    marginCollision: number = 5;
    canvasArea: HTMLCanvasElement = document.getElementById("area") as HTMLCanvasElement;
    canvasObjects: HTMLCanvasElement = document.getElementById("objects") as HTMLCanvasElement;
    ctxArea?: CanvasRenderingContext2D;
    ctx?: CanvasRenderingContext2D;
    width: number = 0;
    height: number = 0;
    worldx: number = 0; //deletar
    worldy: number = 0; //dletar
    speed: number = 1//0.5; deletar
    world: any = {
        x: 0,
        y: 0
    };
    keys: any = {};

    //keys
    pressedLastKey: string = "";
    delayKeyPress: number = 10;
    lastKeyPress: number = 0;
    arrowKeys: any = {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight"
    }

    //classes
    // magicFieldBlue: Others = new Others();
    magicFieldBlue: MagicBlueField = new MagicBlueField();
    minotaur: Minotaur = new Minotaur();
    player: Player = new Player();
    trees: Trees = new Trees();
    ground: Ground = new Ground();

    constructor() {
        this.addlisteners();
        this.addListenersControls("s");
        this.createCanvas();
        this.resizeCanvas();
        this.initSocket();
        this.gameLoop();
    }

    createCanvas() {
        // let canvas = document.getElementById("area") as HTMLCanvasElement;
        // this.ctx = canvas.getContext("2d") || undefined;

        this.ctx = this.canvasObjects.getContext("2d") || undefined;
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

        let w = this.width;
        let h = this.height;

        let sw = Math.trunc(w / this.scale);
        let sh = Math.trunc(h / this.scale);

        if (sw % 2 == 0) { sw--; }
        if (sh % 2 == 0) { sh--; }

        this.width = sw * this.scale;
        this.height = sh * this.scale;

        this.canvasObjects.width = this.width;
        this.canvasObjects.height = this.height;
        // this.canvasObjects.width = this.width * this.dpr;
        // this.canvasObjects.height = this.height * this.dpr;
        this.canvasObjects.style.width = this.width + "px";
        // this.canvasObjects.style.height = this.height + "px";
        this.canvasObjects.style.height = this.height + "px";
        // this.canvasObjects.style.height = "900px";

        this.ground.contentground.sizex = this.width;
        this.ground.contentground.sizey = this.height;

        //para fazer o chao carregar ao andar
        this.ground.groundx = this.ground.contentground.x;
        this.ground.groundy = this.ground.contentground.y;

        let x = Math.trunc(this.width / this.scale) - 1;
        x = x / 2;
        let diffx = this.player.locationPlayer.x - x;
        x = diffx * this.scale;

        let y = Math.trunc(this.height / this.scale) - 1;
        y = y / 2;
        let diffy = this.player.locationPlayer.y - y;
        y = diffy * this.scale;
        // if(this.player.locationPlayer.y < y) zeroy = true;
        // y = y * this.scale - (this.player.locationPlayer.y * this.scale);

        this.world.x += x;
        this.world.y += y;
        // zerox ? this.world.x -= x : this.world.x += x;
        // zeroy ? this.world.y -= y : this.world.y -= y;
    }


    drawObjects() {

        this.ctx?.clearRect(0, 0, this.width, this.height);

        //se estiver legando, ver se passar worldx e worldy separados
        this.ground.drawGround(this.ctx!, this.world.x, this.world.y, this.width, this.height);
        this.minotaur.drawMinotaur(this.ctx!, this.world.x, this.world.y, this.minotaurImage, this.width, this.height, this.dpr);

        if (this.name) {
            this.player.drawPlayer(this.ctx!, this.playerImage, this.width, this.height, this.dpr);
            if (this.magicFieldBlue.countShow < this.magicFieldBlue.frameDuration) {
                this.magicFieldBlue.drawMagicFieldBlue(this.ctx!, this.magicBlueFieldImage, this.width, this.height, this.dpr, this.player.size.x);
                this.magicFieldBlue.countShow++;
            }
        }
        this.trees.drawTrees(this.ctx!, this.world.x, this.world.y, this.width, this.height);
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
            // this.setIdPlayer(data.id);
            this.player.setId(data.id);
            this.log(`seu codigo ${data.id}`);
        });

        this.socket.on('playerJoin', (data: any) => {
            this.log(`jogador ${data.nome} entrou`);
        });

        this.socket.on('createPlayer', (data: any) => {
            console.log(data);
            // this.createPlayer(data.id);
        });

        this.socket.on('movePlayer', (data: any) => {
            // this.movePlayer(data.id, data.direction);
        });


        this.socket.on('playerAction', (data: any) => {
            this.log(data.acao);
        });


    }

    addlisteners() {
        document.getElementById("join")?.addEventListener("click", () => this.joinGame());
        // document.getElementById("action")?.addEventListener("click", () => this.sendAction());
        document.addEventListener("resize", this.resizeCanvas);
    }

    addListenersControls(id?: string) {
        document.addEventListener("keydown", (event) => {
            // let now = new Date().getSeconds();
            if ((new Date().getTime() - this.lastKeyPress) > this.delayKeyPress) {
                //       return;;
                //     }
                // else{
                this.keys[event.key] = true;
                this.lastKeyPress = new Date().getTime();
            }
            // console.log(;new Date().getTime());
            // console.log(this.lastKeyPress);
            // console.log(now - this.lastKeyPress);
        });
        document.addEventListener("keyup", (event) => {
            this.keys[event.key] = false;
            // this.stopPlayer();
            this.player.stop(this.keys);
        });
    }

    joinGame() {
        if (this.player.getId()) {
            // this.world.x = 0;
            // this.world.y = 0;
            let input = document.getElementById("name") as HTMLInputElement;
            this.name = input.value;
            this.socket.emit("playerJoin", this.name);
            this.log(`voce entrou como ${this.name}`);
            // this.createPlayer(this.id);
            this.player.drawPlayer(this.ctx!, this.playerImage, this.width, this.height, this.dpr);
            this.socket.emit("createPlayer", { id: this.id });
            this.addListenersControls(this.id);
        }
    }

    log(message: string) {
        let li = document.createElement("li");
        li.textContent = message;
        document.getElementById("logs")?.appendChild(li);
    }

    private gameLoop = () => {
        this.player.move(this.keys, this.world, this.width, this.height, this.dpr, this.minotaur.randomX, this.minotaur.randomY, this.minotaur.size);
        this.drawObjects();
        requestAnimationFrame(this.gameLoop);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const i = new index();



});