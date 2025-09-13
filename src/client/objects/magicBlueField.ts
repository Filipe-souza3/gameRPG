export class MagicBlueField {

    scale:number = 64;
    localField = "./imgs/others/";
    img: string = this.localField + "magic_field_blue.png";
    size: number = 32;
    maxFrames: number = 11;
    lastFrameTime: number = 0;
    frameDuration: number = 100;
    countFrames: number = 0;
    frames: any = [
        { y: 0, x: 0 },
        { y: 0, x: 64 },
        { y: 0, x: (64 * 2) },
        { y: 0, x: (64 * 3) },
        { y: 0, x: (64 * 4) },
        { y: 0, x: (64 * 5) },
        { y: 0, x: (64 * 6) },
        { y: 0, x: (64 * 7) },
        { y: 0, x: (64 * 8) },
        { y: 0, x: (64 * 9) },
        { y: 0, x: (64 * 10) },
        { y: 0, x: (64 * 11) }
    ];
    magicFieldBlue: any = {};
    countShow: number = 0;

    constructor() {
        this.magicFieldBlue = { x: 100, y: 64, size: this.size, img: this.img, frames: this.frames };
    }

    drawMagicFieldBlue(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number, dpr: number, playerSize: number) {

        let fieldImg = img;
        fieldImg.src = this.magicFieldBlue.img;

        let x = Math.trunc(width / this.scale) - 1;
        x = x / 2;
        x = x * this.scale;
        let y = Math.trunc(height / this.scale) - 1;
        y = y / 2;
        y = y * this.scale;

        ctx.drawImage(fieldImg,
            this.magicFieldBlue.frames[this.countFrames % this.magicFieldBlue.frames.length].x,
            this.magicFieldBlue.frames[this.countFrames % this.magicFieldBlue.frames.length].y,
            this.magicFieldBlue.size, this.magicFieldBlue.size,
            x, y,
            // ((width * dpr) / 2) - (playerSize / 2), ((height * dpr) / 2) - (playerSize / 2),
            this.magicFieldBlue.size * 2, this.magicFieldBlue.size * 2);

        if (this.countFrames >= this.maxFrames) { this.countFrames = 0; }

        if (new Date().getTime() - this.lastFrameTime > this.frameDuration) {
            this.countFrames++;
            this.lastFrameTime = new Date().getTime();
        }
    }

    getMagicFieldBlue() {
        return this.magicFieldBlue;
    }

    getCountFrames() {
        return this.countFrames;
    }
    setCountFrames(count: number) {
        this.countFrames = count;
    }

}
