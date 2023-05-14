class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
        this.i = 0;
    }

    init(data) {
        this.finalScore = data.score;
        this.finalMultiplier = data.multiplier;
        this.finalSpeed = data.speed;
        this.isHighScore = data.isHighScore;
        this.highScore = data.highScore;
        this.highestMultiplier = data.highestMultiplier;
        this.bestSpeed = data.bestSpeed;
    }

    preload() {
        // * Menu Music
        this.load.audio('chill', 'assets/music/PerituneMaterial_SnowChill.mp3')

        // * Keys
        this.load.image('space_key', 'assets/sprites/controls/space_key.png')
        this.load.image('a_key', 'assets/sprites/controls/a_key.png')
        this.load.image('d_key', 'assets/sprites/controls/d_key.png')
        this.load.image('f_key', 'assets/sprites/controls/f_key.png')
        this.load.image('c_key', 'assets/sprites/controls/c_key.png')

    }
    create ()
    {     
        // * Play Music
        this.titleMusic = this.sound.add('chill', {volume: 0.25, loop: true});
        this.titleMusic.play();

        // border
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
        
        //* SCORE *//

        this.statsTextConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '30px',
            color: '#fff',
            align: 'center'
        }

        if(this.finalScore == 0) {
            this.statsTextConfig.fontSize = '10px'

            this.finalScoreText = 'Your\nFinal Score\nWill Appear\nHere.'
            this.finalMultiplierText = 'Score Increases faster\nthe longer\n you drive.'
            this.finalSpeedText = 'Your\ncurrent\nspeed.'

            this.highScoreText = ''
            this.highestMultiplierText = ''
            this.bestSpeedText = ''

            this.spaceText = 'Press Space\nTo Start'
        } else {
            this.finalScoreText = `${this.finalScore}`
            this.finalMultiplierText = `x${this.finalMultiplier}`
            this.finalSpeedText = `${this.finalSpeed}`

            this.highScoreText = `${this.highScore}`
            this.highestMultiplierText = `Best\nx${this.highestMultiplier}`
            this.bestSpeedText = `Best\n${this.bestSpeed}`

            this.spaceText = 'Space\nTo Restart'
        }
        
        this.hsv = Phaser.Display.Color.HSVColorWheel();

        this.scoreTextConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '48px',
            fill: '#fff',
            align: 'center'
        }

        this.UITextConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '16px',
            color: '#fff'
        }

        this.bestTextConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '16px',
            color: '#fff',
            align: 'center'
        }

        //  Rainbow Fill

        this.text1 = this.add.text(centerX, centerY - 192 - borderUISize*3.5, 'New High Score!', this.statsTextConfig).setOrigin(0.5).setAlpha(0);
        this.text2 = this.add.text(centerX, centerY - 192, this.finalScoreText, this.scoreTextConfig).setOrigin(0.5).setAlpha(0);
        this.text2.setShadow(2, 2, "#333333", 2, true, true);
        this.text3 = this.add.text(centerX, centerY - 192 + borderUISize*4.5, this.highScoreText, this.UITextConfig).setOrigin(0.5).setAlpha(0);

        this.rainbowBestRight = this.add.text(centerX + centerX/2, centerY - borderUISize*5.5, 'New Best!', this.UITextConfig).setOrigin(0.5).setAlpha(0);
        this.multiplierTextUI = this.add.text(centerX + centerX/2, centerY - borderUISize*3, 'Multiplier', this.UITextConfig).setOrigin(0.5).setAlpha(0);
        this.finalMultiplierTextUI = this.add.text(centerX + centerX/2, centerY, this.finalMultiplierText, this.statsTextConfig).setOrigin(0.5).setAlpha(0);
        this.highestMultiplierTextUI = this.add.text(centerX + centerX/2, centerY + borderUISize*6, this.highestMultiplierText, this.bestTextConfig).setOrigin(0.5).setAlpha(0);

        this.rainbowBestLeft = this.add.text(centerX/2, centerY - borderUISize*5.5, 'New Best!', this.UITextConfig).setOrigin(0.5).setAlpha(0);
        this.speedTextUI = this.add.text(centerX/2, centerY - borderUISize*3, 'Speed', this.UITextConfig).setOrigin(0.5).setAlpha(0);
        this.finalSpeedTextUI = this.add.text(centerX/2, centerY, this.finalSpeedText, this.statsTextConfig).setOrigin(0.5).setAlpha(0);
        this.bestSpeedTextUI = this.add.text(centerX/2, centerY + borderUISize*6, this.bestSpeedText, this.bestTextConfig).setOrigin(0.5).setAlpha(0);

        // fade in 
        this.tweens.add({
            targets: this.text2,
            alpha: 1,
            duration: 500,
        })

        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: [this.multiplierTextUI, this.finalMultiplierTextUI, this.speedTextUI, this.finalSpeedTextUI],
                alpha: 1,
                duration: 500,
            })
            if(this.isHighScore) {
                this.tweens.add({
                    targets: [this.text1, this.rainbowBestLeft, this.rainbowBestRight],
                    alpha: 1,
                    duration: 500,
                })
            } else {
                this.tweens.add({
                    targets: [this.text3, this.highestMultiplierTextUI, this.bestSpeedTextUI],
                    alpha: 1,
                    duration: 500,
                })
            }
        })

        // * KEYS* //

        this.keyPressed = false;
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

        // * MENU UI *//

        this.UITextConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '12px',
            fill: '#FFF',
            align: 'center'
        }

        this.startText = this.add.text(centerX, centerY + 192 + borderPadding, this.spaceText, this.UITextConfig).setOrigin(0.5).setAlpha(0);
        this.startKey = this.add.sprite(centerX, centerY + 192, 'space_key').setScale(0.75).setAlpha(0);

        this.time.delayedCall(1500, () => {
            // fade in title
            this.tweens.add({
                targets: [this.startText, this.startKey],
                alpha: 1,
                duration: 1000,
            })
        })

        this.menuText = this.add.text(centerX/2, centerY + 256 + borderPadding, 'Menu', this.UITextConfig).setOrigin(0.5).setAlpha(0);
        this.menuKey = this.add.sprite(centerX/2, centerY + 256, 'f_key').setScale(0.75).setAlpha(0);

        this.creditsUIText = this.add.text(centerX + centerX/2, centerY + 256 + borderPadding, 'Credits', this.UITextConfig).setOrigin(0.5).setAlpha(0);
        this.creditsKey = this.add.sprite(centerX + centerX/2, centerY + 256, 'c_key').setScale(0.75).setAlpha(0);
        
        this.time.delayedCall(2500, () => {
            this.tweens.add({
                targets: [this.menuText, this.menuKey, this.creditsUIText, this.creditsKey],
                alpha: 1,
                duration: 1000,
            })
        })
    }

    update ()
    {   
        // rainbow effect
        const top = this.hsv[this.i].color;
        const bottom = this.hsv[359 - this.i].color;
        this.text2.setTint(top, bottom, top, bottom);
        this.rainbowBestLeft.setTint(top, bottom, top, bottom);
        this.rainbowBestRight.setTint(top, bottom, top, bottom);

        this.i++;

        if (this.i === 360)
        {
            this.i = 0;
        }

        // * MENU
        if (Phaser.Input.Keyboard.JustDown(keySPACE) && this.keyPressed == false) {
            this.keyPressed = true;
            this.tweens.add({
                targets: this.titleMusic,
                volume: 0,
                duration: 2500,
                onComplete: () =>  {this.titleMusic.stop()}
            })
            this.cameras.main.fadeOut(2500, 0, 0, 0)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('playScene');
            })
        }

        if (Phaser.Input.Keyboard.JustDown(keyF) && this.keyPressed == false) {
            this.keyPressed = true;
            this.tweens.add({
                targets: this.titleMusic,
                volume: 0,
                duration: 2500,
                onComplete: () =>  {this.titleMusic.stop()}
            })
            this.cameras.main.fadeOut(2500, 0, 0, 0)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.scene.start('menuScene');
            })
        }

    }
}