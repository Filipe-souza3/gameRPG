export class Others {

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
    countShow:number = 0;

    constructor() {
        this.magicFieldBlue = { x: 100, y: 64, size: this.size, img: this.img, frames: this.frames };
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
