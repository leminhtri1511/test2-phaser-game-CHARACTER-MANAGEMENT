import GameScene from "./scenes/GameScene.js";

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.RESIZE, // Tự động điều chỉnh kích thước theo màn hình
        autoCenter: Phaser.Scale.CENTER_BOTH, // Căn giữa game
    },
    scene: [GameScene]
};

let game = new Phaser.Game(config);
