class Pause extends Phaser.Scene {
   constructor() {
       super("pauseScene");
   }

   init(data) {
      this.music = data.music;
   }
   create() {

      // keys
      this.space_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.esc_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
      this.f_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      this.c_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);

      // bg
      this.bg = this.add.rectangle(0, 0, 480, 854, 0x000, 0.3).setOrigin(0)

      // title
      this.titleTextConfig = {
         fontFamily: 'Pixel_NES',
         fontSize: '74px',
         fill: '#fff',
         align: 'center'
     }

     this.pauseText = this.add.text(centerX, centerY - 192, 'PAUSED', this.titleTextConfig).setOrigin(0.5)

     // controls
     this.UITextConfig = {
         fontFamily: 'Pixel_NES',
         fontSize: '12px',
         fill: '#FFF',
         align: 'center'
     }

     this.startText = this.add.text(centerX, centerY + 192 + borderPadding, 'Resume', this.UITextConfig).setOrigin(0.5);
     this.startKey = this.add.sprite(centerX, centerY + 192, 'space_key').setScale(0.75);

     this.tutorialText = this.add.text(centerX/2, centerY + 256 + borderPadding, 'Menu', this.UITextConfig).setOrigin(0.5);
     this.tutorialKey = this.add.sprite(centerX/2, centerY + 256, 'f_key').setScale(0.75);

     this.creditsUIText = this.add.text(centerX + centerX/2, centerY + 256 + borderPadding, 'Restart', this.UITextConfig).setOrigin(0.5);
     this.creditsKey = this.add.sprite(centerX + centerX/2, centerY + 256, 'c_key').setScale(0.75);
   }

   update() {
      if(Phaser.Input.Keyboard.JustDown(this.space_key) || Phaser.Input.Keyboard.JustDown(this.esc_key)) {
         this.scene.stop("pauseScene")
         this.scene.resume("playScene")
     }

     if(Phaser.Input.Keyboard.JustDown(this.f_key)) {
         this.music.stop()
         this.scene.stop("pauseScene")
         this.scene.stop("playScene")
         this.scene.start("menuScene")
      }

      if(Phaser.Input.Keyboard.JustDown(this.c_key)) {
         this.music.stop()
         this.scene.stop("pauseScene")
         this.scene.stop("playScene")
         this.scene.start("playScene")
      }
   }
}