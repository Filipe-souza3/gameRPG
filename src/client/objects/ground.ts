
export class Ground {

    localImage = "../imgs/others/";
    contentground: any = { x: 0, y: 0, sizex: 0, sizey: 0, img: this.localImage + "grass.jpg" };
    groundx: number = 0;
    groundy: number = 0;

    constructor() { }

    drawGround(ctx: CanvasRenderingContext2D, worldx:number, worldy:number, width: number, height: number) {
        let ground = new Image();
        ground.src = this.contentground.img;

        let moveX = Math.floor((this.groundx - width) - worldx);
        let moveY = Math.floor((this.groundy - height) - worldy);
        let moveXX = Math.floor((this.groundx + width) - worldx);
        let moveYY = Math.floor((this.groundy + height) - worldy);
        let y = Math.floor(this.groundy - worldy);
        let x = Math.floor(this.groundx - worldx);

        //center
        ctx.drawImage(ground, x, y, width + 8, height + 8);
        //left
        ctx.drawImage(ground, moveX, y, width, height);
        //right
        ctx.drawImage(ground, moveXX, y, width, height);
        //up
        ctx.drawImage(ground, x, moveY, width, height);
        //down
        ctx.drawImage(ground, x, moveYY, width, height);
        //top left
        ctx.drawImage(ground, moveX, moveY, width, height);

        ctx.lineWidth = 0;

        if (this.groundx > (worldx)) {
            this.groundx = this.groundx - width;
        }
        if (this.groundx < (worldx)) {
            this.groundx = this.groundx + width;
        }
        if (this.groundy > (worldy)) {
            this.groundy = this.groundy - height;
        }
        if (this.groundy < (worldy)) {
            this.groundy = this.groundy + height;
        }
    }
    // drawGround(ctx: CanvasRenderingContext2D, world:any, width: number, height: number) {
    //     let ground = new Image();
    //     ground.src = this.contentground.img;

    //     let moveX = Math.floor((this.groundx - width) - world.x);
    //     let moveY = Math.floor((this.groundy - height) - world.y);
    //     let moveXX = Math.floor((this.groundx + width) - world.x);
    //     let moveYY = Math.floor((this.groundy + height) - world.y);
    //     let y = Math.floor(this.groundy - world.y);
    //     let x = Math.floor(this.groundx - world.x);

    //     //center
    //     ctx.drawImage(ground, x, y, width + 8, height + 8);
    //     //left
    //     ctx.drawImage(ground, moveX, y, width, height);
    //     //right
    //     ctx.drawImage(ground, moveXX, y, width, height);
    //     //up
    //     ctx.drawImage(ground, x, moveY, width, height);
    //     //down
    //     ctx.drawImage(ground, x, moveYY, width, height);
    //     //top left
    //     ctx.drawImage(ground, moveX, moveY, width, height);

    //     ctx.lineWidth = 0;

    //     if (this.groundx > (world.x)) {
    //         this.groundx = this.groundx - width;
    //     }
    //     if (this.groundx < (world.x)) {
    //         this.groundx = this.groundx + width;
    //     }
    //     if (this.groundy > (world.y)) {
    //         this.groundy = this.groundy - height;
    //     }
    //     if (this.groundy < (world.y)) {
    //         this.groundy = this.groundy + height;
    //     }
    // }
}