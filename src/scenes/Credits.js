class Credits extends Phaser.Scene {
   constructor() {
       super("creditsScene");
       this.i = 0;
   }

   init(data) {
      this.lastScene = data.lastScene;
  }

   preload() {
       // * Menu Music
       this.load.audio('chill', 'assets/music/PerituneMaterial_SnowChill.mp3')

   }
   create ()
   {    
      // fade in scene
      this.cameras.main.fadeIn(500, 0, 0, 0)

       // border
       this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
       this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
       this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);
       this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0).setDepth(1);

       // * TITLE *//
       
       this.hsv = Phaser.Display.Color.HSVColorWheel();

       this.titleTextConfig = {
           fontFamily: 'Pixel_NES',
           fontSize: '30px',
           fill: '#000',
           align: 'center'
       }

       //  Rainbow Stroke
       this.text2 = this.add.text(centerX, borderUISize*5, 'Credits', this.titleTextConfig).setOrigin(0.5).setAlpha(0);
       this.text2.setStroke('#fff', 16);
       this.text2.setShadow(2, 2, "#333333", 2, true, true);

       // fade in title
       this.tweens.add({
           targets: this.text2,
           alpha: 1,
           duration: 2000,
       })

       // * CREDITS * //

       // * MENU UI *//

       this.UITextConfig = {
         fontFamily: 'Pixel_NES',
         fontSize: '12px',
         fill: '#FFF',
         align: 'center'
     }

       this.titleTextConfig.fill = '#fff'
       this.titleTextConfig.fontSize = '24px'
       this.creatorTitle = this.add.text(centerX, centerY - 192, 'Creator', this.UITextConfig).setOrigin(0.5).setAlpha(0);
       this.creator = this.add.text(centerX, centerY - 192 + borderUISize*2.5, 'Hector Torres', this.titleTextConfig).setOrigin(0.5).setAlpha(0);

       this.designerTitle = this.add.text(centerX, centerY - 128, 'Visual Art', this.UITextConfig).setOrigin(0.5).setAlpha(0);
       this.designer = this.add.text(centerX, centerY - 128 + borderUISize*2.5, 'Hector Torres', this.titleTextConfig).setOrigin(0.5).setAlpha(0);

       this.artistTitle = this.add.text(centerX, centerY - 64, 'Music', this.UITextConfig).setOrigin(0.5).setAlpha(0);
       this.artist = this.add.text(centerX, centerY - 64 + borderUISize*2.5, 'Peritune', this.titleTextConfig).setOrigin(0.5).setAlpha(0);

       this.sfxTitle = this.add.text(centerX, centerY, 'Sound Effects', this.UITextConfig).setOrigin(0.5).setAlpha(0);
       this.sfxDesigners = this.add.text(centerX, centerY + borderUISize, 'boo (also Hector)\nLittleRobotSoundFactory\ntommccann\nArtList', this.titleTextConfig).setOrigin(0.5, 0).setAlpha(0);
       
       this.targets = [this.creatorTitle, this.creator, this.designerTitle,this.designer, this.artistTitle, this.artist, this.sfxTitle, this.sfxDesigners];

       this.time.delayedCall(1000, () => {
         // fade in credits
         this.tweens.add({
             targets: this.targets,
             alpha: 1,
             duration: 2000,
         })
     })

       // * KEYS* //

       this.keyPressed = false;
       keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);


       this.startText = this.add.text(centerX, centerY + 256 + borderPadding, 'Go Back', this.UITextConfig).setOrigin(0.5).setAlpha(0);
       this.startKey = this.add.sprite(centerX, centerY + 256, 'a_key').setScale(0.75).setAlpha(0);

       this.time.delayedCall(2000, () => {
           // fade in controls
           this.tweens.add({
               targets: [this.startText, this.startKey],
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
       if (Phaser.Input.Keyboard.JustDown(keyLEFT) && this.keyPressed == false) {
           this.keyPressed = true;
           this.cameras.main.fadeOut(500, 0, 0, 0)
           this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
               this.scene.setVisible(true, this.lastScene);
               this.scene.resume(this.lastScene);
               this.scene.stop('creditsScene');
           })
       }
   }

   // create() {
   //     this.scene.start("playScene");
   // }

   // update() {
   
   // }
}