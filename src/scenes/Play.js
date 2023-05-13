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
        this.load.spritesheet('bomb', './assets/sprites/sheets/bomb.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 5});

        // * Effects
        this.load.atlas('explosion', 'assets/sprites/sheets/explosion.png','assets/sprites/sheets/explosion.json');

        // * BG
        this.load.image('rainbow', 'assets/sprites/rainbow.png');

        // * UI
        this.load.image('heart', 'assets/sprites/heart.png');

        // * BGM
        this.load.audio('unknown_cities', 'assets/music/PerituneMaterial_Unknown_Cities.mp3');

        // * SFX
        this.load.audio('sfx_slip', 'assets/sounds/slip.mp3');
        this.load.audio('sfx_explosion', 'assets/sounds/explosion.mp3');

    }

    create() {
        // reset paramaters
        this.scrollSpeed = 3;
        this.maxScrollSpeed = 17;
        this.itemSpeed = 60 * this.scrollSpeed;

        // add rainbow
        this.rainbow = this.add.tileSprite(centerX - 160, 0, 320, 854, 'rainbow').setOrigin(0, 0);

        // play music
        this.music = this.sound.add('unknown_cities', {volume: 0.25, loop: true});
        this.music.play();

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);

        // * effects * //

        // Explosion Animation
        this.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNames('explosion', {
                prefix: 'explosion',
                start: 0,
                end: 15
            }),
            frameRate: 24,
        })

        // Y Coordinate For kart
        this.kart_y = game.config.height - borderUISize*2 - borderPadding*2;

        // * lanes * // 

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

        // * kart * //
        
        // add kart
        this.kart = this.physics.add.sprite(this.lanes[this.currentLane].x, this.kart_y, 'kart').setOrigin(0.5);
        this.isMoving = false;
        this.moveSpeed = 400; // pixels / sec
        this.kart.setImmovable();
        this.kart.setDepth(1);
        this.kart.health = 5;
        this.kart.hit = false;
        this.kart.invincible = true;
        this.kart.destroyed = false;

        // keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // * health UI * //
        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        this.hearts.createMultiple({
            key: 'heart',
            setOrigin: {
                x: 1,
                y: 1,
            },
            setXY: {
                x: game.config.width - borderUISize*2,
                y: game.config.height - borderUISize,
                stepY: -64
            },
            quantity: this.kart.health
        })

        // for(let i = 0; i < this.kart.health; i++) {
        //     this.heart = this.add.sprite(game.config.width - borderUISize*2, game.config.height - borderUISize - (i*64), 'heart').setOrigin(1);
        //     this.hearts.push(this.heart);
        // }

        // * OBSTACLES * //

        // bomb animation
        this.anims.create({
            key: 'fuse',
            frames: this.anims.generateFrameNumbers('bomb', { start: 0, end: 5, first: 0}),
            frameRate: 12,
            repeat: -1
        });

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

        // * DIFFICULTY TIMER * //

        this.difficultyTimer = this.time.addEvent({
            delay: 10000,
            callback: this.speedup,
            callbackScope: this,
            loop: true
        })

    }

    addItem() {
        let lane = Phaser.Math.Between(0,2);
        let probability = Phaser.Math.Between(0,100);
        let item = undefined;
        if((probability >= 0) && (probability <= 10)) {
            item = new Obstacle(this, this.itemSpeed, this.lanes[lane].x, 'bomb');
            item.setScale(2);
            item.body.setSize(8,8,true)
            item.anims.play('fuse');
            this.obstacleGroup.add(item);
        }
        if((probability >= 11) && (probability <= 100)) {
            item = new Obstacle(this, this.itemSpeed, this.lanes[lane].x, 'banana');
            this.bananaGroup.add(item);
        }
    }

    speedup() {
        if(this.scrollSpeed <= this.maxScrollSpeed) {
            this.scrollSpeed += .5
            this.itemSpeed = 60 * this.scrollSpeed;
            this.music.rate += 0.001; 
            console.log(this.itemSpeed)
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
                // console.log(this.kart_x)
                this.physics.moveTo(this.kart, this.kart_x , this.kart_y, this.moveSpeed)
                // console.log(this.physics.moveTo(this.kart, this.kart_x , this.kart_y, this.moveSpeed));
                // console.log(this.currentLane)
            } else if (Phaser.Input.Keyboard.JustDown(keyRIGHT) && this.currentLane < 2 && this.isMoving == false) {
                this.isMoving = true;
                this.currentLane += 1;
                // console.log(this.currentLane)
                this.kart_x = this.lanes[this.currentLane].x;
                // console.log(this.kart_x)
                this.physics.moveTo(this.kart, this.kart_x , this.kart_y, this.moveSpeed)
                // console.log(this.physics.moveTo(this.kart, this.kart_x , this.kart_y, this.moveSpeed));
            }

            // check for collisions
            this.physics.world.overlap(this.kart, this.obstacleGroup, this.bombCollision, null, this);

            this.physics.world.collide(this.kart, this.bananaGroup, this.bananaCollision, null, this);
        

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

            // * Spins Kart if Hit by Banana
            if(this.kart.hit == true) {
                this.kart.angle += 6;
                this.time.delayedCall(300, () => { 
                    this.kart.hit = false;
                    this.kart.angle = 0;
                });
            }

            if(this.kart.destroyed) {
                this.tweens.add({
                    targets: this.music,
                    volume: 0.05,
                    duration: 500
                })
                //this.music.stop();
            }
        }
    }

    destroyKart() {
        this.kart.destroyed = true;
        this.cameras.main.shake(500, 0.0075);

        // * Make it so kart stops moving horizontally
        this.kart.body.reset(this.kart.body.x + this.kart.width/2, this.kart.body.y + this.kart.height/2);

        // * stop obstacles
        this.obstacleGroup.children.each(function(obstacle) {
            obstacle.setVelocityY(0);
        }, this);
        this.bananaGroup.children.each(function(obstacle) {
        obstacle.setVelocityY(0);
        }, this);
        
        // play sound
        this.sound.play('sfx_explosion', { volume: 0.1 })

        // play explosion animation
        let boom = this.kart.play('explosion', true);
        boom.on('animationcomplete', () => {
            this.kart.destroy();
        })
    }

    bombCollision(kart, bomb) {
        bomb.destroy();
        this.destroyKart();
        this.hearts = [];
    }

    bananaCollision(kart, banana) {
        console.log("called bananaCollision()")
        // destory the banana
        banana.destroy();

        // shake for dramatic effect *
        this.cameras.main.shake(450, 0.005);

        // remove health
        this.kart.health -= 1;
        this.kart.hit = true;

        this.hearts.remove(this.hearts.getLast(true), true);


        if(this.kart.health <= 0) {
            this.destroyKart();
        } else {
            this.sound.play('sfx_slip', { volume: 0.5 })
        }
        console.log(this.kart.health)
    }
}