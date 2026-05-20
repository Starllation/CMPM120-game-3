class End extends Phaser.Scene {
    constructor() {
        super("End");
        this.spaceKey = null;

    }

    create() {

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        if (win === true) {
            this.sound.play('winSound', {volume: 0.15});
            this.add.rectangle(720, 450, 7500, 1000, 0xFFC4CA); // background rectangle
            this.scoreBox = new Box(this, 400, 300, 'bigBox', null, 3)
        }

        if (win === false) {
            this.sound.play('loseSound', {volume: 0.2});
            this.add.rectangle(720, 450, 7500, 1000, 0x9B5850); // background rectangle
            this.scoreBox = new Box(this, 400, 300, 'bigBox', null, 4)
        }





    }


    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.start("Platformer")
        }

    }




}