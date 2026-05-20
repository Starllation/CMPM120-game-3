class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.image("tilemap_tiles2", "tilemap_packed2.png");
        this.load.image("tilemap_tiles3", "tilemap_packed3.png");
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON


         // Load images for animations
        this.load.image('coin1', 'pngs/tile_0151.png');
        this.load.image('coin2', 'pngs/tile_0152.png');
        this.load.image('heartFull', 'pngs/tile_0044.png');
        this.load.image('heartEmpty', 'pngs/tile_0046.png');
        this.load.image('diamond', 'pngs/tile_0067.png');
        this.load.image('flag1', 'pngs/tile_0111.png');
        this.load.image('flag2', 'pngs/tile_0112.png');
        this.load.image('spike', 'pngs/tile_0068.png');
        this.load.image('donut1', 'pngs/tile_0014.png');
        this.load.image('donut2', 'pngs/tile_0015.png');
        this.load.image('donut3', 'pngs/tile_0013.png');
        this.load.image('pole', 'pngs/tile_0131.png')
        this.load.image('mountains', 'pngs/mountains.png');
        this.load.image('clouds', 'pngs/clouds.png');
        this.load.image('sky', 'platformer-level-1.png');
        this.load.image('redCandle1', 'pngs/redCandle1.png');
        this.load.image('redCandle2', 'pngs/redCandle2.png');
        this.load.image('blueCandle1', 'pngs/blueCandle1.png');
        this.load.image('blueCandle2', 'pngs/blueCandle2.png');
        this.load.image('exclaim', 'pngs/exclaim.png');
        this.load.image('cracker1', 'pngs/cracker1.png');
        this.load.image('cracker2', 'pngs/cracker2.png');
        this.load.image('cracker3', 'pngs/cracker3.png');
        this.load.image('movingPlat1', 'pngs/plat1.png');
        this.load.image('movingPlat2', 'pngs/plat2.png');
        this.load.image('movingPlat3', 'pngs/plat3.png');
        this.load.image('key', 'pngs/key.png');
        this.load.image('bigBox', 'pngs/box_big.png')
        this.load.image('smallBox', 'pngs/box_small.png')
        
        //load sound
        this.load.audio('hmmSound', 'sound/hmm.ogg');
        this.load.audio('loseSound', 'sound/lose.ogg');
        this.load.audio('winSound', 'sound/win.ogg');
        this.load.audio('heartSound', 'sound/heart.mp3');
        this.load.audio('diamondSound', 'sound/diamond.mp3');
        this.load.audio('coinSound', 'sound/coin.mp3');
        this.load.audio('clickSound', 'sound/click.ogg');
        this.load.audio('hurtSound', 'sound/hurt.mp3');
        this.load.audio('flagSound', 'sound/flag.mp3')



        
        // Oooh, fancy. A multi atlas is a texture atlas which has the textures spread
        // across multiple png files, so as to keep their size small for use with
        // lower resource devices (like mobile phones).
        // kenny-particles.json internally has a list of the png files
        // The multiatlas was created using TexturePacker and the Kenny
        // Particle Pack asset pack.
        this.load.setPath("./assets/particles/"); // sets the path that the atlas will look for the pngs in. The top already put us in assets, and now we are in particles
        this.load.multiatlas("kenny-particles", "kenny-particles.json");











    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("Platformer");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}