// const localTree = "./trees/";
// export const trees: any[] = [
//     { x: 100, y: 100, size: 130, color: "orange", img: localTree + "tree.webp" },
//     { x: 100, y: 450, size: 130, color: "orange", img: localTree + "tree.webp" },
//     { x: -100, y: 250, size: 130, color: "orange", img: localTree + "tree.webp" },
//     { x: 400, y: 250, size: 130, color: "orange", img: localTree + "tree.webp" },
//     { x: 300, y: -200, size: 80, color: "gray", img: localTree + "tree3.png" },
//     { x: 20, y: 10, size: 40, color: "green", img: localTree + "tree4.png" },
//     { x: -150, y: 50, size: 55, color: "blue", img: localTree + "tree2.png" },
//     { x: -200, y: -150, size: 100, color: "black", img: localTree + "tree1.png" },
//     { x: -200, y: -400, size: 230, color: "black", img: localTree + "demon.png" },
// ];

export class Trees {

    localImage = "../imgs/trees/";
    allTrees: any[] = [
        { x: 100, y: 100, size: 130, color: "orange", img: this.localImage + "tree.webp" },
        { x: 100, y: 450, size: 130, color: "orange", img: this.localImage + "tree.webp" },
        { x: -100, y: 250, size: 130, color: "orange", img: this.localImage + "tree.webp" },
        { x: 400, y: 250, size: 130, color: "orange", img: this.localImage + "tree.webp" },
        { x: 300, y: -200, size: 80, color: "gray", img: this.localImage + "tree3.png" },
        { x: 20, y: 10, size: 40, color: "green", img: this.localImage + "tree4.png" },
        { x: -150, y: 50, size: 55, color: "blue", img: this.localImage + "tree2.png" },
        { x: -200, y: -150, size: 100, color: "black", img: this.localImage + "tree1.png" },
        { x: -200, y: -400, size: 230, color: "black", img: this.localImage + "demon.png" },
    ];

    constructor() { }

    tree(ctx: CanvasRenderingContext2D, tree: any, screenX: number, screenY: number) {
        let trees = new Image();
        // trees = img;
        trees.src = tree.img;
        ctx.drawImage(trees, screenX, screenY, tree.size, tree.size);


        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX, screenY, tree.size, tree.size);
    }

    drawTrees(ctx: CanvasRenderingContext2D, worldx:number, worldy:number, width:number, height:number) {
        this.allTrees.forEach((obj) => {

            if ((obj.x - worldx) > ((obj.size * 0.8) * (-1)) && (obj.x - worldx) < width
                && (obj.y - worldy) > ((obj.size * 0.8) * (-1)) && (obj.y - worldy) < height) {


                let screenX = obj.x - worldx;
                let screenY = obj.y - worldy;

                this.tree(ctx, obj, screenX, screenY);

                // }
                // this.ctx!.fillStyle = obj.color;
                // this.ctx!.fillRect(screenX, screenY, obj.size, obj.size);
            }
        });
    }
}

