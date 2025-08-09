import { lutimesSync } from "fs";
import { server } from "../server/server";
import { io } from 'socket.io-client';
import { Socket } from "socket.io";



export class index{

    socket = io("http://localhost:3000");
    
    init(){
        let s = new server();
        // s.listen();
        s.init();
        console.log("iniciou client");

        this.socket.on('newPlayer', (name:string)=>{
            this.log(`${name} entrou no jogo`);
        });  

        this.socket.on('updateAction', (action:string)=>{
            this.log(`alguem ${action}`);
        });


    }

    addlisteners(){
         
        (document.getElementById("join") as HTMLInputElement)?.addEventListener("click", ()=>this.joinGame());
        // document.getElementById("action")?.addEventListener("click", ()=>this.sendAction());
    }

    joinGame(){
        let input = document.getElementById("name") as HTMLInputElement;
        let name = input.value;
        this.socket.emit("playerJoin", name);
        this.log(`voce entrou como ${name}`);
    }

    sendAction(){
        this.socket.emit("playerAction", 'fez uma acao');
    }



    log(message:string){
        let li = document.createElement("li");
        li.textContent = message;
        document.getElementById("logs")?.appendChild(li);
    }
}

const i = new index();
i.init();
i.addlisteners();