console.log("uwu")

let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 854,
    scene: [ Menu, Play ],
    physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { y: 0 }
        }
      }
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

let borderUISize = game.config.height / 20;
let borderPadding = borderUISize / 2;
let centerX = game.config.width / 2;
let centerY = game.config.height / 2;
const obstacleHeight = 64;
const obstacleWidth = 64;