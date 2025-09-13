
export class Trees {

    localImage = "../imgs/trees/";
    scale: number = 64;
    allTrees: any[] = [
        { x: 1, y: 1, size: { x: 2, y: 2 }, color: "orange", img: this.localImage + "tree.webp" },
        { x: 5, y: 7, size: { x: 2, y: 2 }, color: "orange", img: this.localImage + "tree.webp" },
        { x: 4, y: 2, size: { x: 2, y: 2 }, color: "orange", img: this.localImage + "tree.webp" },
        { x: 8, y: 1, size: { x: 2, y: 2 }, color: "orange", img: this.localImage + "tree.webp" },
        { x: 12, y: 4, size: { x: 1, y: 1 }, color: "gray", img: this.localImage + "tree3.png" },
        { x: 0, y: 0, size: { x: 1, y: 1 }, color: "green", img: this.localImage + "tree4.png" },
        { x: 8, y: 7, size: { x: 1, y: 1 }, color: "blue", img: this.localImage + "tree2.png" },
        { x: 13, y: 6, size: { x: 2, y: 2 }, color: "black", img: this.localImage + "tree1.png" },
        // { x: 200, y: 400, size: 230, color: "black", img: this.localImage + "demon.png" },
    ];

    constructor() { }

    tree(ctx: CanvasRenderingContext2D, tree: any, screenX: number, screenY: number) {
        let trees = new Image();
        // trees = img;
        trees.src = tree.img;
        ctx.drawImage(trees, screenX, screenY, tree.size.x * this.scale, tree.size.y * this.scale);


        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX, screenY, tree.size.x * this.scale, tree.size.y * this.scale);
    }

    drawTrees(ctx: CanvasRenderingContext2D, worldx: number, worldy: number, width: number, height: number) {
        this.allTrees.forEach((obj) => {

            if (((obj.x * this.scale) - worldx) > (((obj.size.x * this.scale) * 0.8) * (-1)) && ((obj.x * this.scale) - worldx) < width
                && ((obj.y * this.scale) - worldy) > (((obj.size.y * this.scale) * 0.8) * (-1)) && ((obj.y * this.scale) - worldy) < height) {


                let screenX = (obj.x * this.scale) - worldx;
                let screenY = (obj.y * this.scale) - worldy;

                this.tree(ctx, obj, screenX, screenY);

                // }
                // this.ctx!.fillStyle = obj.color;
                // this.ctx!.fillRect(screenX, screenY, obj.size, obj.size);
            }
        });
    }
}

