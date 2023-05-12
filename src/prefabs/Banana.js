class Banana extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, lane) {
        // call Phaser Physics Sprite constructor
        super(scene, lane, -obstacleHeight, 'banana'); 

        this.parentScene = scene;
        this.velocity = velocity;
    
        // add object to existing scene
        this.parentScene.add.existing(this);
        this.parentScene.physics.add.existing(this);
        this.setVelocityY(velocity);
        this.setImmovable();
        this.newObstacle = true;
    }

    // speedup(multiplier) {
    //     this.moveSpeed = this.initialSpeed*multiplier;
    //  }
  
    update(time, delta) {
        if(!this.parentScene.kart.destroyed) {
            let speedCorrection = (1000/60)/delta;
            this.setVelocityY(this.velocity*speedCorrection);
        }

        // add new obstacle when existing obstacle hits center y
        if(this.newObstacle && this.y > centerY) {
            // (recursively) call parent scene method from this context
            this.parentScene.addItem(this.parent, this.velocity);
            this.newObstacle = false;
        }

        // destroy obstacle if it reaches the bottom of the screen
        if(this.y > game.config.height + this.height) {
            this.destroy();
        }
    }
  
    //  // reset rocket to "ground"
    //  reset() {
    //     this.y = game.config.height - borderUISize - borderPadding;
    //  }
}