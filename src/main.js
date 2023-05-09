/* 

* Hector Torres
* Rocket Patrol: Apollo's Rebirth
* 10 hours

* Mods List:

* - Track a high score that persists across scenes and display it in the UI (5)
* - Add your own (copyright-free) background music to the Play scene (please be mindful of the volume) (5)
* - Implement the speed increase that happens after 30 seconds in the original game (5)
    ! NOTE: The game speeds up 20% every 10 seconds (until 300%)
* - Randomize each spaceship's movement direction at the start of each play (5)
* Allow the player to control the Rocket after it's fired (5)

* - Display the time remaining (in seconds) on the screen (10)
* - Create a new title screen (e.g., new artwork, typography, layout) (10)
* - Implement parallax scrolling for the background (10)

* - Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (15)
* Implement a new timing/scoring mechanism that adds time to the clock for successful hits (15)
* Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (15)

* Sources:

*BGM: https://peritune.com/blog/2021/09/08/retrorpg_battle2/
*Planets in BG: https://helianthus-games.itch.io/pixel-art-planets?download
*Font: https://fonts2u.com/pixel-nes.font
*SFX: https://freesound.org/people/LittleRobotSoundFactory/packs/16681/
*https://pixabay.com/sound-effects/search/8-bit/

*/
console.log("uwu")

let config = {
    type: Phaser.AUTO,
    width: 480,
    height: 854,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT;

let borderUISize = game.config.height / 21;
let borderPadding = borderUISize / 2;