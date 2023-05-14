class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
        this.i = 0;
    }

    preload() {
        // * Menu Music
        this.load.audio('chill', 'assets/music/PerituneMaterial_SnowChill.mp3')
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

        //* TITLE *//
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
    }

    // create() {
    //     this.scene.start("playScene");
    // }

    // update() {
    
    // }
}