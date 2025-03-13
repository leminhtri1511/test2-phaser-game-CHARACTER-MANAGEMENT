export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
    }

    preload() {
        this.load.image("sky", "https://labs.phaser.io/assets/skies/sky2.png");
        this.load.image("character", "https://labs.phaser.io/assets/sprites/phaser-dude.png");
    }

    create() {
        const { width, height } = this.scale;

        // **Tải trạng thái từ LocalStorage**
        this.loadGameState();

        // **Thêm hình nền**
        this.add.image(width / 2, height / 2, "sky").setDisplaySize(width, height);

        // **Thêm nhân vật**
        this.character = this.add.image(width / 3, height / 2, "character").setScale(2.5);

        // **Hiển thị Level**
        this.levelText = this.add.text(this.character.x, this.character.y - 60, `Lv ${this.level}`, {
            fontSize: "24px",
            fill: "#FFFF00",
            fontWeight: "bold",
        }).setOrigin(0.5);

        // **Tạo thanh EXP**
        this.expBarBg = this.add.rectangle(this.character.x, this.character.y + 50, 100, 10, 0x555555);
        this.expBar = this.add.rectangle(this.character.x - 50, this.character.y + 50, 0, 10, 0x00ff00).setOrigin(0, 0.5);
        this.updateExpBar(); // Load trạng thái thanh EXP từ LocalStorage

        // **Hiển thị số vàng**
        this.goldText = this.add.text(50, 15, `Gold: ${this.gold}`, {
            fontSize: "30px",
            fill: "#FFD700",
        });

        // **Hiển thị UI chỉ số nhân vật**
        const statsX = width / 2 + 30;
        const statsY = height / 2 - 50;
        let index = 0;

        this.statTexts = {}; // Lưu text UI chỉ số

        for (let key in this.playerStats) {
            const statY = statsY + index * 30;

            // **Hiển thị chỉ số**
            this.statTexts[key] = this.add.text(statsX, statY, `${this.capitalize(key)}: ${this.playerStats[key]}`, {
                fontSize: "20px",
                fill: "#ffffff",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: { x: 10, y: 5 }
            });

            // **Thêm nút `+` để nâng cấp**
            let plusButton = this.add.text(statsX - 20, statY, "+", {
                fontSize: "24px",
                fill: "#00ff00",
                fontWeight: "bold",
            }).setInteractive();

            plusButton.on("pointerdown", () => {
                this.upgradeStat(key);
            });

            index++;
        }

        // **Danh sách nhiệm vụ**
        this.tasks = [
            { name: "Collect items", reward: 100 },
            { name: "Fight monsters", reward: 200 },
            { name: "Work hard", reward: 150 }
        ];

        // **Hiển thị danh sách nhiệm vụ**
        this.createTaskUI();

        // **Thêm nút Reset Game**
        this.createResetButton();
    }

    createTaskUI() {
        const { width, height } = this.scale;
        const taskX = 20;
        let taskY = height - 120; // Vị trí hiển thị danh sách nhiệm vụ

        this.add.text(taskX, taskY - 30, "Tasks:", {
            fontSize: "22px",
            fill: "#ffffff",
            fontWeight: "bold",
        });

        this.tasks.forEach((task, index) => {
            let taskButton = this.add.text(taskX, taskY + index * 30, `✔ ${task.name} (+${task.reward} Gold)`, {
                fontSize: "18px",
                fill: "#FFD700",
                backgroundColor: "#444",
                padding: { x: 10, y: 5 },
            }).setInteractive();

            taskButton.on("pointerdown", () => {
                this.completeTask(task);
            });
        });
    }

    completeTask(task) {
        this.gold += task.reward;
        this.goldText.setText(`Gold: ${this.gold}`);

        this.showGoldEffect(`+${task.reward} Gold`, "#FFD700");

        this.saveGameState();
    }

    upgradeStat(stat) {
        if (this.gold >= 50) {
            this.gold -= 50;
            this.playerStats[stat] += 10;
            this.exp += 10; // Mỗi lần nâng cấp chỉ số, EXP tăng
            this.updateExpBar();
            this.goldText.setText(`Gold: ${this.gold}`);
            this.statTexts[stat].setText(`${this.capitalize(stat)}: ${this.playerStats[stat]}`);

            this.showGoldEffect(`-50 Gold`, "#ff0000");

            this.saveGameState();
        } else {
            const { width } = this.scale;
            let warningText = this.add.text(width / 2, 80, "Not enough gold!", {
                fontSize: "24px",
                fill: "#ff0000",
                fontWeight: "bold",
                backgroundColor: "#000000",
                padding: { x: 10, y: 5 }
            }).setOrigin(0.5);

            this.time.delayedCall(1000, () => {
                warningText.destroy();
            });

            console.log("❌ Not enough gold!");
        }
    }

    updateExpBar() {
        const expNeeded = this.level * 100;
        const expPercent = Math.min(this.exp / expNeeded, 1);
        this.expBar.width = expPercent * 100;

        if (this.exp >= expNeeded) {
            this.levelUp();
        }
    }

    levelUp() {
        this.exp = 0;
        this.level++;
        this.levelText.setText(`Lv ${this.level}`);
        this.updateExpBar();

        this.showGoldEffect(`Level Up!`, "#FFFF00");

        this.saveGameState();
    }

    createResetButton() {
        const { width } = this.scale;
        const resetButton = this.add.text(width - 80, 15, "Reset", {
            fontSize: "24px",
            fill: "#FF0000",
            fontWeight: "bold",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 },
        }).setInteractive();

        resetButton.on("pointerdown", () => {
            localStorage.removeItem("gameState");
            this.scene.restart();
        });
    }

    showGoldEffect(text, color) {
        const { width } = this.scale;
        const goldText = this.add.text(width / 2, 50, text, {
            fontSize: "24px",
            fill: color,
            fontWeight: "bold",
        }).setOrigin(0.5);

        this.tweens.add({
            targets: goldText,
            y: goldText.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => {
                goldText.destroy();
            }
        });
    }

    loadGameState() {
        const savedState = localStorage.getItem("gameState");
        if (savedState) {
            const gameState = JSON.parse(savedState);
            this.gold = gameState.gold;
            this.playerStats = gameState.playerStats;
            this.level = gameState.level;
            this.exp = gameState.exp;
        } else {
            this.gold = 100;
            this.level = 1;
            this.exp = 0;
            this.playerStats = {
                strength: 10,
                stamina: 10,
                intelligence: 10,
                luck: 10
            };
        }
    }

    saveGameState() {
        const gameState = {
            gold: this.gold,
            playerStats: this.playerStats,
            level: this.level,
            exp: this.exp
        };
        localStorage.setItem("gameState", JSON.stringify(gameState));
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    update() {}
}
