class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
        this.i = 0;
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

        // * TITLE *//
        
        this.hsv = Phaser.Display.Color.HSVColorWheel();

        this.titleTextConfig = {
            fontFamily: 'Pixel_NES',
            fontSize: '74px',
            fill: '#000',
            align: 'center'
        }

        //  Rainbow Stroke
        this.text2 = this.add.text(centerX, centerY - 192, 'Rainbow\nKart', this.titleTextConfig).setOrigin(0.5).setAlpha(0);
        this.text2.setStroke('#fff', 16);
        this.text2.setShadow(2, 2, "#333333", 2, true, true);

        // fade in title
        this.tweens.add({
            targets: this.text2,
            alpha: 1,
            duration: 2000,
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

        this.startText = this.add.text(centerX, centerY + 192 + borderPadding, 'Space\nTo Start', this.UITextConfig).setOrigin(0.5).setAlpha(0);
        this.startKey = this.add.sprite(centerX, centerY + 192, 'space_key').setScale(0.75).setAlpha(0);

        this.time.delayedCall(1000, () => {
            // fade in title
            this.tweens.add({
                targets: [this.startText, this.startKey],
                alpha: 1,
                duration: 2000,
            })
        })

        this.tutorialText = this.add.text(centerX/2, centerY + 256 + borderPadding, 'Tutorial', this.UITextConfig).setOrigin(0.5).setAlpha(0);
        this.tutorialKey = this.add.sprite(centerX/2, centerY + 256, 'f_key').setScale(0.75).setAlpha(0);

        this.creditsUIText = this.add.text(centerX + centerX/2, centerY + 256 + borderPadding, 'Credits', this.UITextConfig).setOrigin(0.5).setAlpha(0);
        this.creditsKey = this.add.sprite(centerX + centerX/2, centerY + 256, 'c_key').setScale(0.75).setAlpha(0);
        
        this.time.delayedCall(2000, () => {
            // fade in title
            this.tweens.add({
                targets: [this.tutorialText, this.tutorialKey, this.creditsUIText, this.creditsKey],
                alpha: 1,
                duration: 2000,
            })
        })
    }

    update ()
    {   
        // rainbow effect
        const top = this.hsv[this.i].color;
        const bottom = this.hsv[359 - this.i].color;
        this.text2.setTint(top, bottom, top, bottom);

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
                this.scene.start('tutorialScene');
            })
        }

        if (Phaser.Input.Keyboard.JustDown(keyC) && this.keyPressed == false) {
            this.keyPressed = true;
            this.scene.launch('creditsScene', {
                lastScene: 'menuScene'
            });
            this.scene.setVisible(false, 'menuScene')
            this.scene.pause('menuScene');
            this.keyPressed = false;
        }
    }

    // create() {
    //     this.scene.start("playScene");
    // }

    // update() {
    
    // }
}