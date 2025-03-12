export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image("sky", "https://labs.phaser.io/assets/skies/sky2.png");
        this.load.image("character", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
    }

    create() {
        this.updateSceneSize(); // Gọi lần đầu khi game khởi động

        // **Lắng nghe sự kiện thay đổi kích thước màn hình**
        this.scale.on("resize", this.updateSceneSize, this);
    }

    updateSceneSize() {
        const { width, height } = this.scale; // Lấy kích thước hiện tại của màn hình

        console.log(`🔄 Màn hình thay đổi: width=${width}, height=${height}`);

        // **Xóa các hình ảnh cũ để cập nhật lại bố cục**
        this.children.removeAll();

        // **Thêm hình nền full màn hình**
        this.add.image(width / 2, height / 2, "sky").setDisplaySize(width, height);

        // **Thêm nhân vật vào giữa màn hình**
        const gameCharacter = this.add.image(width / 2, height / 2, "character");
        gameCharacter.setScale(2); // Tăng kích thước nhân vật lên 1.5 lần
    }

    update() {
        // Logic game (sẽ thêm sau)
    }
}
