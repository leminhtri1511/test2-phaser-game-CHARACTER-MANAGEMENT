import GameScene from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE, // Game tự điều chỉnh theo màn hình
        autoCenter: Phaser.Scale.CENTER_BOTH // Luôn căn giữa game
    },
    scene: [GameScene]
};

let game = new Phaser.Game(config);
