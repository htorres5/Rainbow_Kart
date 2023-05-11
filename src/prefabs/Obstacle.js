class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, velocity, lane) {
        // call Phaser Physics Sprite constructor
        super(scene, lane, -trainHeight, 'obstacle'); 

        this.parentScene = scene;
    
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
  
    update() {
        // add new obstacle when existing obstacle hits center y
        if(this.newObstacle && this.y > centerY) {
            // (recursively) call parent scene method from this context
            this.parentScene.addObstacle(this.parent, this.velocity);
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