class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    // preload() {
    
    // }

    create() {
        this.scene.start("playScene");
    }

    // update() {
    
    // }
}