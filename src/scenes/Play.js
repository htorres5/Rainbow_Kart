class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('train', 'assets/sprites/train.png');
        this.load.image('obstacle', 'assets/sprites/obstacle.png');
    }

    create() {
        // reset paramaters
        this.obstacleSpeed = 450;
        this.obstacleSpeedMax = 1000;

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);

        // * TRAIN * // 

        // Y Coordinate For Train
        this.train_y = game.config.height - borderUISize*2 - borderPadding*2;

        // Lane X Coordinates
        this.x_of_lane0 = centerX - (64 + borderPadding);
        this.x_of_lane1 = centerX;
        this.x_of_lane2 = centerX + (64 + borderPadding);

        // Lane Coordinates
        this.lane0 =  new Phaser.Math.Vector2(this.x_of_lane0, this.train_y);
        this.lane1 = new Phaser.Math.Vector2(this.x_of_lane1, this.train_y);
        this.lane2 = new Phaser.Math.Vector2(this.x_of_lane2, this.train_y);
        this.lanes = [this.lane0, this.lane1, this.lane2];
        this.currentLane = 1;
        
        console.log(this.lanes);
        console.log(this.lanes[1].x);
        
        // add train
        this.train = this.physics.add.sprite(this.lanes[this.currentLane].x, this.train_y, 'train').setOrigin(0.5);
        this.isMoving = false;
        this.moveSpeed = 400; // pixels / sec
        this.train.setImmovable();
        this.train.setDepth(1);
        this.train.destroyed = false;

        // keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // * OBSTACLES * //
        this.obstacleGroup = this.add.group({
            runChildUpdate: true
        });

        // delay to spawn obstacles at start
        this.time.delayedCall(2500, () => { 
            this.addObstacle(); 
        });

    }

    addObstacle() {
        let speedVariance = Phaser.Math.Between(0,50);
        let lane = Phaser.Math.Between(0,2);
        let obstacle = new Obstacle(this, this.obstacleSpeed - speedVariance, this.lanes[lane].x);
        this.obstacleGroup.add(obstacle);
    }

    update() {

        // * LANE MOVEMENT * //

        if(Phaser.Input.Keyboard.JustDown(keyLEFT) && this.currentLane > 0 && this.isMoving == false) {
            this.isMoving = true;
            this.currentLane -= 1;
            this.train_x = this.lanes[this.currentLane].x;
            console.log(this.train_x)
            this.physics.moveTo(this.train, this.train_x , this.train_y, this.moveSpeed)
            console.log(this.physics.moveTo(this.train, this.train_x , this.train_y, this.moveSpeed));
            console.log(this.currentLane)
        } else if (Phaser.Input.Keyboard.JustDown(keyRIGHT) && this.currentLane < 2 && this.isMoving == false) {
            this.isMoving = true;
            this.currentLane += 1;
            console.log(this.currentLane)
            this.train_x = this.lanes[this.currentLane].x;
            console.log(this.train_x)
            this.physics.moveTo(this.train, this.train_x , this.train_y, this.moveSpeed)
            console.log(this.physics.moveTo(this.train, this.train_x , this.train_y, this.moveSpeed));
        }

        const tolerance = 10;

        const distance = Phaser.Math.Distance.BetweenPoints(this.train, this.lanes[this.currentLane]);

        if (this.train.body.speed > 0) {

            if (distance < tolerance) {
                this.train.body.reset(this.train_x, this.train_y);
                this.isMoving = false;
            }
        }
      
    }
}