class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // * Protaganist
        this.load.image('kart', 'assets/sprites/kart.png');

        // * Obstacles
        this.load.image('banana', 'assets/sprites/banana.png');
        this.load.image('obstacle', 'assets/sprites/obstacle.png');

        // * BG
        this.load.image('rainbow', 'assets/sprites/rainbow.png')
    }

    create() {
        // reset paramaters
        this.scrollSpeed = 3;
        this.maxScrollSpeed = 17;
        this.itemSpeed = 60 * this.scrollSpeed;

        // add rainbow
        this.rainbow = this.add.tileSprite(centerX - 160, 0, 320, 832, 'rainbow').setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);

        // * kart * // 

        // Y Coordinate For kart
        this.kart_y = game.config.height - borderUISize*2 - borderPadding*2;

        // Lane X Coordinates
        this.x_of_lane0 = centerX - (64);
        this.x_of_lane1 = centerX;
        this.x_of_lane2 = centerX + (64);

        // Lane Coordinates
        this.lane0 =  new Phaser.Math.Vector2(this.x_of_lane0, this.kart_y);
        this.lane1 = new Phaser.Math.Vector2(this.x_of_lane1, this.kart_y);
        this.lane2 = new Phaser.Math.Vector2(this.x_of_lane2, this.kart_y);
        this.lanes = [this.lane0, this.lane1, this.lane2];
        this.currentLane = 1;
        
        console.log(this.lanes);
        console.log(this.lanes[1].x);
        
        // add kart
        this.kart = this.physics.add.sprite(this.lanes[this.currentLane].x, this.kart_y, 'kart').setOrigin(0.5);
        this.isMoving = false;
        this.moveSpeed = 400; // pixels / sec
        this.kart.setImmovable();
        this.kart.setDepth(1);
        this.kart.destroyed = false;

        // keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // * OBSTACLES * //

        this.obstacleGroup = this.add.group({
            runChildUpdate: true
        });

        this.bananaGroup = this.add.group({
            runChildUpdate: true
        });

        // delay to spawn obstacles at start
        this.time.delayedCall(2500, () => { 
            this.addItem(); 
        });

    }

    addItem() {
        let lane = Phaser.Math.Between(0,2);
        let probability = Phaser.Math.Between(0,100);
        let item = undefined;
        if((probability >= 0) && (probability <= 50)) {
            item = new Obstacle(this, this.itemSpeed, this.lanes[lane].x);
            this.obstacleGroup.add(item);
        }
        if((probability >= 51) && (probability <= 100)) {
            item = new Banana(this, this.itemSpeed, this.lanes[lane].x);
            this.bananaGroup.add(item);
        }
    }

    update() {

        // * LANE MOVEMENT * //
        if (!this.kart.destroyed) {

            // * RAINBOW * //
            this.rainbow.tilePositionY -= this.scrollSpeed;

            if(Phaser.Input.Keyboard.JustDown(keyLEFT) && this.currentLane > 0 && this.isMoving == false) {
                this.isMoving = true;
                this.currentLane -= 1;
                this.kart_x = this.lanes[this.currentLane].x;
                console.log(this.kart_x)
                this.physics.moveTo(this.kart, this.kart_x , this.kart_y, this.moveSpeed)
                console.log(this.physics.moveTo(this.kart, this.kart_x , this.kart_y, this.moveSpeed));
                console.log(this.currentLane)
            } else if (Phaser.Input.Keyboard.JustDown(keyRIGHT) && this.currentLane < 2 && this.isMoving == false) {
                this.isMoving = true;
                this.currentLane += 1;
                console.log(this.currentLane)
                this.kart_x = this.lanes[this.currentLane].x;
                console.log(this.kart_x)
                this.physics.moveTo(this.kart, this.kart_x , this.kart_y, this.moveSpeed)
                console.log(this.physics.moveTo(this.kart, this.kart_x , this.kart_y, this.moveSpeed));
            }

            // check for collisions
            this.physics.world.collide(this.kart, this.obstacleGroup, this.kartCollision, null, this);

            this.physics.world.collide(this.kart, this.bananaGroup, this.kartCollision, null, this);
        

            const tolerance = 10;

            const distance = Phaser.Math.Distance.BetweenPoints(this.kart, this.lanes[this.currentLane]);

            console.log("called update()")
            if(this.kart.destroyed == false) {
                if (this.kart.body.speed > 0) {

                    if (distance < tolerance) {
                        this.kart.body.reset(this.kart_x, this.kart_y);
                        this.isMoving = false;
                    }
                }
            }
        }
    }

    kartCollision() {
        this.kart.destroyed = true;
        console.log("called kartCollision()")
        this.cameras.main.shake(500, 0.0075);
        this.obstacleGroup.children.each(function(obstacle) {
            obstacle.setVelocityY(0);
          }, this);
        this.bananaGroup.children.each(function(obstacle) {
        obstacle.setVelocityY(0);
        }, this);

        this.kart.destroy();
    }
}