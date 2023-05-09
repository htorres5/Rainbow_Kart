class Train extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
    
        // add object to existing scene
        scene.add.existing(this);
        this.initialSpeed = 5;
        this.moveSpeed = this.initialSpeed; 
        this.y = y;  // pixels per frame
    }

    speedup(multiplier) {
        this.moveSpeed = this.initialSpeed*multiplier;
     }
  
    update() {
        // left/right movement
        if(keyLEFT.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        } else if (keyRIGHT.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        }
    }
  
    //  // reset rocket to "ground"
    //  reset() {
    //     this.y = game.config.height - borderUISize - borderPadding;
    //  }
}