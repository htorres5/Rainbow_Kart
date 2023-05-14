class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // * Protaganist
        this.load.image('kart', 'assets/sprites/kart.png');

        // * Items
        this.load.image('banana', 'assets/sprites/banana.png');
        this.load.image('obstacle', 'assets/sprites/obstacle.png');
        this.load.spritesheet('bomb', './assets/sprites/sheets/bomb.png', {frameWidth: 32, frameHeight: 32, startFrame: 0, endFrame: 5});
        this.load.image('heart', 'assets/sprites/heart.png');
        this.load.spritesheet('star', './assets/sprites/sheets/star.png', {frameWidth: 64, frameHeight: 64, startFrame: 0, endFrame: 5});

        // * Effects
        this.load.atlas('explosion', 'assets/sprites/sheets/explosion.png','assets/sprites/sheets/explosion.json');

        // * BG
        this.load.image('rainbow', 'assets/sprites/rainbow.png');
    

        // * BGM
        this.load.audio('unknown_cities', 'assets/music/PerituneMaterial_Unknown_Cities.mp3');
        this.load.audio('fun', 'assets/music/PerituneMaterial_Battle_Fun.mp3')

        // * SFX
        this.load.audio('sfx_slip', 'assets/sounds/slip.mp3');
        this.load.audio('sfx_explosion', 'assets/sounds/explosion.mp3');
        this.load.audio('heal', 'assets/sounds/heal.wav');
        this.load.audio('max_health', 'assets/sounds/max_health.wav');
        this.load.audio('multiplier', 'assets/sounds/coin.wav');
        this.load.audio('hit', 'assets/sounds/hit.wav')
    }

    create() {
        // fade in scene
        this.cameras.main.fadeIn(1000, 0, 0, 0)

        // add rainbow
        this.rainbow = this.add.tileSprite(centerX - 160, 0, 320, 854, 'rainbow').setOrigin(0, 0);

        // play music
        this.music = this.sound.add('unknown_cities', {volume: 0.25, loop: true});
        this.music.play();

        this.starMusic = this.sound.add('fun', {volume: 0.25, loop: true});

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize*7, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
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

        // Star animation
        this.anims.create({
            key: 'yipee',
            frames: this.anims.generateFrameNumbers('star', { start: 0, end: 5, first: 0}),
            frameRate: 24,
            repeat: -1
        });

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
        this.kart.hit = false;
        this.kart.invincible = false;
        this.kart.destroyed = false;

        this.kart.health = 5;
        this.kart.maxHealth = 8;

        // keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // * UI * //

        this.UITextConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '12px',
            color: '#222034'
        }

        // * Health * //

        this.healthPositionY = centerY + 192,
        this.healthPositionX = game.config.width - borderUISize*1.5
        this.hearts = this.add.group({
            classType: Phaser.GameObjects.Image
        });

        this.heartsConfig = {
            key: 'heart',
            setOrigin: {
                x: 1,
                y: 1,
            },
            setXY: {
                x: this.healthPositionX,
                y: this.healthPositionY,
                stepY: -64
            },
            quantity: this.kart.health
        }
        this.hearts.createMultiple(this.heartsConfig);
        this.isHealthMax = false;

        this.maxHealthTextConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '25px',
            strokeThickness: 4,
            stroke: '#000000'
        }
    
        this.maxHealthText = this.add.text(game.config.width - borderUISize*5, centerY - 340, 'MAX', this.maxHealthTextConfig).setOrigin(0.5).setAlpha(0);

        // * Score * //

        this.score = 0;
        this.multiplier = 1;

        this.scoreTextConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '30px',
            color: '#df7126'
        }
        
        this.multiplierTextConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '30px',
            color: '#222034'
        }

        this.scoreText = this.add.text(centerX, borderUISize*3, `${this.score}`, this.scoreTextConfig).setOrigin(0.5).setDepth(2);

        this.multiplierTextUI = this.add.text(game.config.width - borderUISize, borderUISize, `Multiplier`, this.UITextConfig).setOrigin(1, 0.5).setDepth(2);
        this.multiplierText = this.add.text(game.config.width - borderUISize, borderUISize*3, `x${this.multiplier}`, this.multiplierTextConfig).setOrigin(1, 0.5).setDepth(2);

        
        this.scoreTimer = this.time.addEvent({
            delay: 100,
            callback: this.updateScore,
            callbackScope: this,
            loop: true
        })

        // * Speed
        // reset paramaters
        this.scrollSpeed = 3;
        this.maxScrollSpeed = 15;
        this.itemSpeed = 60 * this.scrollSpeed;
        this.tolerance = 10;

        this.speedTextConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '30px',
            color: '#222034'
        }

        this.speedTextUI = this.add.text(borderUISize, borderUISize, `Speed`, this.UITextConfig).setOrigin(0, 0.5).setDepth(2);
        this.speedText = this.add.text(borderUISize, borderUISize*3, `${this.itemSpeed}`, this.speedTextConfig).setOrigin(0, 0.5).setDepth(2);

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

        this.heartGroup = this.add.group({
            runChildUpdate: true
        })

        // logic
        this.starDuration = 0;
        this.hasStar = false;
        
        // colors :3
        this.hsv = Phaser.Display.Color.HSVColorWheel();
        this.i = 0;


        this.starGroup = this.add.group({
            runChildUpdate: true,
        })

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

        if((probability >= 0) && (probability <= 2)) {
            item = new Obstacle(this, this.itemSpeed, this.lanes[lane].x, 'heart');
            this.heartGroup.add(item);
        } else if((probability >= 4) && (probability <= 7)) {
            item = new Obstacle(this, this.itemSpeed, this.lanes[lane].x, 'bomb');
            item.setScale(2);
            item.body.setSize(8,8,true)
            item.anims.play('fuse');
            this.obstacleGroup.add(item);
        } else if((probability == 69)) {
            item = new Obstacle(this, this.itemSpeed, this.lanes[lane].x, 'star');
            item.anims.play('yipee');
            this.starGroup.add(item);
        } else {
            item = new Obstacle(this, this.itemSpeed, this.lanes[lane].x, 'banana');
            this.bananaGroup.add(item);
        }
    }

    updateScore() {
        this.score += 50 * this.multiplier;
        this.scoreText.text = `${this.score}`;
    }

    speedup() {
        this.sound.play('multiplier', {volume: 0.25})
        this.multiplier += 1;
        this.multiplierText.text = `x${this.multiplier}`
        if(this.scrollSpeed <= this.maxScrollSpeed) {
            this.scrollSpeed += .5
            this.itemSpeed = 60 * this.scrollSpeed;
            this.speedText.text = `${this.itemSpeed}`;

            this.tolerance += 3;
            this.moveSpeed += 25;
            this.music.rate += 0.001; 
            console.log(this.itemSpeed)
        } else {
            this.speedTextConfig.color = '#ff5f79'
            this.speedText.text = `MAX`;
        }
    }

    update() {

        // * LANE MOVEMENT * //
        if (!this.kart.destroyed) {

            // * RAINBOW * //

            this.rainbow.tilePositionY -= this.scrollSpeed;
            
            // * MOVEMENT * //

            if(Phaser.Input.Keyboard.JustDown(keyLEFT) && this.currentLane > 0 && this.isMoving == false) {
                this.isMoving = true;
                this.currentLane -= 1;
                this.kart_x = this.lanes[this.currentLane].x;
                this.physics.moveTo(this.kart, this.kart_x , this.kart_y, this.moveSpeed)
            } else if (Phaser.Input.Keyboard.JustDown(keyRIGHT) && this.currentLane < 2 && this.isMoving == false) {
                this.isMoving = true;
                this.currentLane += 1;
                this.kart_x = this.lanes[this.currentLane].x;
                this.physics.moveTo(this.kart, this.kart_x , this.kart_y, this.moveSpeed)
            }

            // * COLLISIONS * //

            this.physics.world.overlap(this.kart, this.obstacleGroup, this.bombCollision, null, this);

            this.physics.world.collide(this.kart, this.bananaGroup, this.bananaCollision, null, this);

            this.physics.world.collide(this.kart, this.heartGroup, this.heartCollision, null, this);

            this.physics.world.collide(this.kart, this.starGroup, this.starCollision, null, this);
    

            const distance = Phaser.Math.Distance.BetweenPoints(this.kart, this.lanes[this.currentLane]);

            console.log("called update()")
            if(this.kart.destroyed == false) {
                if (this.kart.body.speed > 0) {

                    if (distance < this.tolerance) {
                        this.kart.body.reset(this.kart_x, this.kart_y);
                        this.isMoving = false;
                    }
                }
            }

            // * OBSTACLE INTERACTIONS * //

            // * Spins Kart if Hit by Banana
            if(this.kart.hit == true) {
                this.kart.angle += 6;

                this.time.delayedCall(300, () => { 
                    this.kart.hit = false;
                    this.kart.angle = 0;
                });
            }

            // * shows MAX if health is max
            if (this.kart.health == this.kart.maxHealth) {
                this.maxHealthText.setAlpha(1);
            } else {
                this.maxHealthText.setAlpha(0);
            }

            // * colors :3
            if(this.hasStar == true) {

                let top = this.hsv[this.i].color;
                let bottom = this.hsv[359 - this.i].color;
                
                this.kart.setTint(top, bottom, top, bottom);
        
                this.i++;
        
                if (this.i === 360)
                {
                    this.i = 0;
                }

                // * ends star invincibility
                if (this.starDuration == 0) {
                    this.kart.clearTint();
                    this.starTimer.remove();
                    this.kart.invincible = false;
                    this.hasStar = false;
                    this.starMusic.stop();
                    this.music.resume();
                    console.log('star ended');
                }
            }


            // * GAME OVER

            if(this.kart.destroyed) {
                this.scoreTimer.remove();
                this.difficultyTimer.remove();
                this.maxHealthText.setAlpha(0);

                // * stop obstacles
                this.obstacleGroup.children.each(function(obstacle) {
                    obstacle.setVelocityY(0);
                }, this);
                this.bananaGroup.children.each(function(obstacle) {
                obstacle.setVelocityY(0);
                }, this);
                this.heartGroup.children.each(function(obstacle) {
                    obstacle.setVelocityY(0);
                }, this);
                this.starGroup.children.each(function(obstacle) {
                    obstacle.setVelocityY(0);
                }, this);

                this.tweens.add({
                    targets: this.music,
                    volume: 0,
                    duration: 2500
                })

                // * go to GameOver Scene
                this.time.delayedCall(2500, () => {
                    this.cameras.main.fadeOut(1000, 0, 0, 0)
                    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                        this.scene.start('gameOverScene', {
                            score: this.score,
                            multiplier: this.multiplier,
                            speed: this.itemSpeed
                        });
                    })
                })
            }
        }
    }

    destroyKart() {
        this.kart.destroyed = true;
        this.cameras.main.shake(500, 0.0075);

        // * Make it so kart stops moving horizontally
        this.kart.body.reset(this.kart.body.x + this.kart.width/2, this.kart.body.y + this.kart.height/2);

        // play sound
        this.sound.play('sfx_explosion', { volume: 0.1 })

        // play explosion animation
        let boom = this.kart.play('explosion', true);
        boom.on('animationcomplete', () => {
            this.kart.destroy();
        })
    }

    heartCollision(kart, heart) {
        heart.destroy();
        if (this.kart.health < this.kart.maxHealth) {
            this.kart.health += 1;
            this.sound.play('heal', {volume: 0.25})
            let lastHeart = this.hearts.getLast(true);
            console.log(lastHeart.y)
            this.hearts.createFromConfig({
                key: 'heart',
                setOrigin: {
                    x: 1,
                    y: 1,
                },
                setXY: {
                    x: this.healthPositionX,
                    y: lastHeart.y - 64,
                },
            })
        } else {
            if(this.isHealthMax == false) {
                this.isHealthMax = true;
                this.maxHealthUI = this.add.rectangle(this.healthPositionX, this.healthPositionY, 64, 512, 0xffffff, .3).setOrigin(1);

                this.maxHealthFlashingText = this.add.text(game.config.width - borderUISize*5, centerY - 128, 'M\nA\nX', this.maxHealthTextConfig).setOrigin(0.5);
                
                this.tweens.add({
                    targets: this.maxHealthFlashingText,
                    alpha: 0,
                    ease: 'Cubic.easeOut',  
                    duration: 300,
                    repeat: -1,
                    yoyo: true
                })
                
                this.time.delayedCall(2000, () => {
                    console.log('called')
                    this.maxHealthUI.destroy();
                    this.maxHealthFlashingText.destroy();
                })
                this.sound.play('max_health', {volume: 0.25})
            } else {
                this.sound.play('multiplier', {volume: 0.25})
                this.multiplier += 1;
                this.multiplierText.text = `x${this.multiplier}`
            }
            
        }
    }

    starCollision(kart, star) {
        star.destroy();
        this.hasStar = true;
        console.log(`start of func: ${this.starDuration} ${this.kart.invincible}`);
        if (this.starDuration == 0) {
            console.log('entered')
            this.music.pause();
            this.starMusic.play();
            this.starTimer = this.time.addEvent({
                delay: 1000,
                callback: () => { this.starDuration -=1; },
                loop: true
            })
        }
        this.starDuration += 20;
        this.kart.invincible = true;
        console.log(`end of func: ${this.starDuration} ${this.kart.invincible}`);
    }

    bombCollision(kart, bomb) {
        console.log(this.kart.invincible)
        if(!this.kart.invincible && this.hasStar == false) {
            bomb.destroy();
            this.hearts.clear(true, true)
            this.destroyKart();
            this.isHealthMax = false;
        } else {
            bomb.setDepth(3);
            // play sound
            this.sound.play('sfx_explosion', { volume: 0.1 })
            bomb.play('explosion', true)
        }
    }

    bananaCollision(kart, banana) {
        console.log("called bananaCollision()")
        // destory the banana
        banana.destroy();

        if(!this.kart.invincible && this.hasStar == false) {
            // shake for dramatic effect *
            this.cameras.main.shake(450, 0.005);


            // remove health
            this.kart.health -= 1;
            this.kart.hit = true;
            this.kart.invincible = true;
            this.isHealthMax = false;
            this.hearts.remove(this.hearts.getLast(true), true);

            if(this.kart.health <= 0) {
                this.destroyKart();
            } else {
                this.sound.play('sfx_slip', { volume: 0.5 })
                this.tweens.add({
                    targets: this.kart,
                    alpha: 0,
                    ease: 'Cubic.easeOut',  
                    duration: 300,
                    loop: 3,
                    yoyo: true,
                    onComplete: () => { 
                            console.log('complete')
                            this.kart.invincible = false; 
                    }
                })
            }


        } else {
            this.sound.play('hit', {volume: 0.25});
        }
        console.log(this.kart.health)
    }
}