// * Go to README.md :3
// * https://pixabay.com/sound-effects/search/explosion/

console.log("uwu")

let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 854,
    scene: [ Menu, Play, Pause, Tutorial, GameOver, Credits ],
    physics: {
        default: 'arcade',
        arcade: {
          debug: false,
          gravity: { y: 0 }
        }
      },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyESC, keySPACE, keyLEFT, keyRIGHT, keyF, keyC;

let borderUISize = game.config.height / 100;
let borderPadding = 40;
let centerX = game.config.width / 2;
let centerY = game.config.height / 2;
const obstacleHeight = 64;
const obstacleWidth = 64;