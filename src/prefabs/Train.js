class Train extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
    
        // add object to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.initialSpeed = 60;
        this.lanes = [(halfway - (64 + borderPadding)), halfway, (halfway + (64+ borderPadding))]
        console.log(this.lanes[2])
        this.moveSpeed = this.initialSpeed; 
        this.lane = 1;
        this.y = y;
    }

    speedup(multiplier) {
        this.moveSpeed = this.initialSpeed*multiplier;
     }
  
    update() {
        // left/right movement
        // if(Phaser.Input.Keyboard.JustDown(keyLEFT) && this.lane > 0) {
        //     this.lane -= 1;
        //     this.xCoord = this.lanes[this.lane];
        //     this.moveTo(this, 300, 280, this.moveSpeed)
        //     console.log(this.lane)
        // } else if (Phaser.Input.Keyboard.JustDown(keyRIGHT) && this.lane < 2) {
        //     this.lane += 1;
        //     this.xCoord = this.lanes[this.lane];
        //     this.scene.physics.arcade.moveTo(this, this.xCoord, this.y, this.moveSpeed)
        //     console.log(this.lane)
        // }
    }
  
    //  // reset rocket to "ground"
    //  reset() {
    //     this.y = game.config.height - borderUISize - borderPadding;
    //  }
}