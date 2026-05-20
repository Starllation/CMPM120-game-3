var totalScore = 0;
var playerHealth = 3;
var totalDiamonds = 0;
var win = false;

class Platformer extends Phaser.Scene {
    constructor() {
        super("Platformer");
        this.dKey = null;
        this.aKey = null;
        this.wKey = null;
        this.spaceKey = null;
    }

    init() {
        // variables and settings
        win = false;
        totalScore = 0;
        playerHealth = 3;
        totalDiamonds = 0;
        this.ACCELERATION = 600;
        this.DRAG = 1000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1300;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.MAX_SPEED = 200;
        this.checkpoint1 = false;
        this.checkpoint2 = false;
        this.checkpoint4 = false;
        this.currentCheckpoint = 0;
        this.hurtTimer = 0;
        this.crackerBlock = false;
        this.riding = false;
        this.hasKey = false;
        this.specialDonutHere = false;
        this.hmmPlayed = false;
        this.isDead = false;
        my.vfx = {}; // object to store the vfxs, similar to how we do sprites so they can be used throughout the scene
    }

    create() {

        // Added a rectangle for a background
        this.add.rectangle(720, 450, 7500, 1000, 0xFFE6DA);

        // tilesprites lets image infinitely scroll
        this.bgSky = this.add.tileSprite(0, 0, 3618, 600, 'sky').setOrigin(0, 0).setScrollFactor(0);
        this.bgMountains = this.add.tileSprite(0, 180, 3618, 600, 'mountains').setOrigin(0, 0).setScrollFactor(0.2);
        this.bgClouds = this.add.tileSprite(0, 150, 3618, 600, 'clouds').setOrigin(0, 0).setScrollFactor(0.5);
        this.bgClouds.setAlpha(0.8);

        this.bgMountains.tileScaleX = 0.2
        this.bgMountains.tileScaleY = 0.2

        this.bgClouds.tileScaleX = 0.2
        this.bgClouds.tileScaleY = 0.2


        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 18, 18, 201, 34);


        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("kenny_tilemap_packed", "tilemap_tiles");
        this.tileset2 = this.map.addTilesetImage("kenny_tilemap_packed2", "tilemap_tiles2");
        this.tileset3 = this.map.addTilesetImage("kenny_tilemap_packed3", "tilemap_tiles3");


        const tilesets = [this.tileset, this.tileset2, this.tileset3]




        // Create background. Layer backBackBackground should be off
        //this.backBackBackground = this.map.createLayer("Back-Back-Background", tilesets, 0, 0);

        this.backBackground = this.map.createLayer("Back-Background", tilesets, 0, 0);

        this.background = this.map.createLayer("Background", tilesets, 0, 0);

        this.groundLayer2 = this.map.createLayer("Ground-n-Platforms2", tilesets, 0, 0);


        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", tilesets, 0, 0);

        this.movingLayer = this.map.createLayer("Moving-Platforms", tilesets, 0, 0);



        // set up key text box
        this.needKeyBox = new Box(this, 1665, 450, 'smallBox', null, 1, 'You need a key!')
        this.donutBox = new Box(this, 2871, 420, 'bigBox', null, 2, "Don't give up!", 'Use door to', 'reset donut!') 
        this.donutBox.hideBox();


        // create vfxs
        // create walking
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['dirt_01.png', 'dirt_02.png'],
            random: true,
            scale: {start: 0.03, end:  0.06},
            maxAliveParticles: 4,
            lifespan: 300,
            gravityY: -80,
            alpha: {start: 1, end: 0.01},
            emitting: false
        });

        //create jumping
        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['dirt_01.png', 'dirt_02.png'],
            scale: {start: 0.02, end:  0.1},
            maxAliveParticles: 8,
            lifespan: 200,
            gravityY: 900,
            alpha: {start: 1, end: 0},
            emitting: false,
            angle: 90,
            blendMode: 'ADD'
        });

        my.vfx.flag = this.add.particles(200, 400, "kenny-particles", {
            frame: 'star_07.png', // exact frame from the atlas
            speed: {min: 200, max: 300}, 
            lifespan: 1000,
            scale: {start: 0.05, end: 0},
            alpha: {start: 1, end: 0.1},
            blendMode: 'ADD', 
            quantity: 15,
            emitting: true, // don't start emitting right away
            duration: 10,
            gravityY: 800,
            angle: {min: -105, max: -75},
            emitting: false
        });

        my.vfx.collect = this.add.particles(200, 400, "kenny-particles", {
            frame: 'star_07.png', // exact frame from the atlas
            speed: {min: 80, max: 100}, 
            lifespan: 300,
            scale: {start: 0.05, end: 0},
            alpha: {start: 1, end: 0.1},
            blendMode: 'ADD', 
            quantity: 3,
            emitting: true, // don't start emitting right away
            duration: 3,
            emitting: false
        });





       

        // Make these layers collidable
        this.groundLayer.setCollisionByProperty({ // Collides gives collision top on ground layer1
            collides: true 
        });
        this.groundLayer2.setCollisionByProperty({ // Collides gives collision on ground layer2
            collides: true 
        });
        this.movingLayer.setCollisionByProperty({ // Gives normal solid collision like layer1
            collides: true 
        });



        // Sets collide property in Tiled so that on ground layer 1, only top is collidable 
        let allTiles = this.groundLayer.getTilesWithin(); // Gets all tiles in this.groundLayer
        for (let i = 0; i < allTiles.length; i++) {
            let tile = allTiles[i];
            if (tile.properties.collides === true) {
                tile.setCollision(false, false, true, false) // args: left, right, up, down
            }
        }


        // set up player avatar
        my.sprite.player = this.physics.add.sprite(17, 528, "platformer_characters", "tile_0000.png") // start values 17, 528 TODO. (2268, 324) for end
        my.sprite.player.setFlipX(true)
        my.sprite.player.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0, 0, this.map.widthInPixels, this.map.heightInPixels)); 
        my.sprite.player.body.setMaxVelocity(this.MAX_SPEED, Infinity) // Args: max horizontal speed, max verticle speed
        my.sprite.player.setCollideWorldBounds(true);




        // set up donuts group
        this.donuts = this.physics.add.group({
            dragX: 300,
            allowRotation: true,
            bounceY: 0.7,
            bounceX: 0.7,
            maxVelocityY: 350
        });
        // creates donuts and adds them to this.donuts group
        this.donuts.create(88, 402, 'donut1').body.setCircle(9); // 9 because arg for that is radius of circle which is half size which is 18
        this.donuts.create(900, 528, 'donut1').body.setCircle(9);
        this.donuts.create(1563, 330, 'donut2').body.setCircle(9);
        this.donuts.create(1106, 420, 'donut3').body.setCircle(9);
         // Create foreground
        this.foreground = this.map.createLayer("Foreground", tilesets, 0, 0);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.groundLayer2);
        this.physics.add.collider(this.donuts, this.groundLayer);
        this.physics.add.collider(this.donuts, this.groundLayer2);
        this.physics.add.collider(my.sprite.player,this.donuts);

        // Enable collision handling for player and platforms on movingLayer and define things that happen on collision
        this.physics.add.collider(my.sprite.player, this.movingLayer, (player, movingPlat) => {
            this.riding = true; 
        });
        




        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      



        // add camera code here
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels + 100, this.map.heightInPixels); // added 100 because the camera width is 1000. So to see end of level, bounds need to be extended to match the 200 increase for cam size. Increase by 100 cause the zoom in is 2x so we need to divide 200 by 2
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50); // args: width, height
        this.cameras.main.setSize(1000, 600); //args: width, height
        this.cameras.main.setZoom(this.SCALE);
        this.cameras.main.setFollowOffset(-90, 10);

        // make animations for coins
        this.anims.create({
            key: 'coinAnim',
            frames: [
                {key: 'coin1'},
                {key: 'coin2'}, 
            ],
            frameRate: 2,
            repeat: -1
        });
        // make animation for flag
        this.anims.create({
            key: 'flagAnim',
            frames: [
                {key: 'flag1'},
                {key: 'flag2'},
            ],
            frameRate: 4,
            repeat: -1
        });
        // make anim for red candle
        this.anims.create({
            key: 'redCandleAnim', 
            frames: [
                {key: 'redCandle1'},
                {key: 'redCandle2'}
            ],
            frameRate: 4,
            repeat: -1
        });
        // make anim for blue candle
        this.anims.create({
            key: 'blueCandleAnim',
            frames: [
                {key: 'blueCandle1'},
                {key: 'blueCandle2'}
            ],
            frameRate: 4,
            repeat: -1
        })


        // Create objects
        // create array to put all coins into. Assigns Tiled object the coin png 
        this.coins = this.map.createFromObjects("Coins", {
            name: "coin",
            key: "coin1",
        });

        this.hearts = this.map.createFromObjects("Hearts", {
            name: "heart",
            key: "heartFull",
        });

        this.diamonds = this.map.createFromObjects("Diamonds", {
            class: "diamond",
            key: "diamond",
        });

        this.spikes = this.map.createFromObjects("Hazards", {
            name: "spike",
            key: "spike",
        });
        
        this.flags = this.map.createFromObjects("Flags", {
            class: "flag", // this puts all flags AND poles into this group. The poles were given the class name "flag" too
            key: 'flag1', 
        });

        this.crackers = this.map.createFromObjects("Crackers", {
            class: "cracker", 
            key: 'cracker1', 
        });

        

        // set cracker textures
        for (let i = 0; i < this.crackers.length; i++) {
            if (this.crackers[i].name == 'cracker1') {
                this.crackers[i].setTexture('cracker1')
            }
            if (this.crackers[i].name == 'cracker2') {
                this.crackers[i].setTexture('cracker2')
            }
            if (this.crackers[i].name == 'cracker3') {
                this.crackers[i].setTexture('cracker3')
            }
        }

        // set poll texture
        for (let i = 0; i < this.flags.length; i++) {
            if (this.flags[i].name == 'pole') {
                this.flags[i].setTexture('pole')
            }
        }

        this.candles = this.map.createFromObjects("Candle", {
            class: "candle", 
            key: 'redCandle1', 
        });

        this.blocks = this.map.createFromObjects("Blocks", {
            name: "exclaim", 
            key: 'exclaim', 
        });

        this.keys = this.map.createFromObjects("Key", {
            class: "key", 
            key: 'key', 
        });

        this.triggers = this.map.createFromObjects("Triggers", {
            class: "trigger", 
            key: 'key', 
        });

        for (let i = 0; i < this.triggers.length; i++) {
            this.triggers[i].setAlpha(0);
        }

        // finds donutDiamond 
        for (let i = 0; i < this.diamonds.length; i++) {
            if (this.diamonds[i].name == 'donutDiamond') {
                this.donutDiamond = this.diamonds[i] // saves the donut named donutDiamond to a separate variable to make toggling easier 
                break;
            }
        }
       

                

        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.hearts, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.diamonds, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.spikes, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.flags, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.blocks, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.crackers, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.keys, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.triggers, Phaser.Physics.Arcade.STATIC_BODY);


        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.coinGroup = this.add.group(this.coins);
        this.heartGroup = this.add.group(this.hearts);
        this.diamondGroup = this.add.group(this.diamonds)
        this.spikeGroup = this.add.group(this.spikes);
        this.flagGroup = this.add.group(this.flags);
        this.blockGroup = this.add.group(this.blocks);
        this.crackerGroup = this.add.group(this.crackers);
        this.keysGroup = this.add.group(this.keys);
        this.triggersGroup = this.add.group(this.triggers);

        // make collision for crackers and assign to variable to be toggled later
        this.crackerCollider = this.physics.add.collider(my.sprite.player, this.crackerGroup)  // collision for player and crackers
        this.crackerCollider2 = this.physics.add.collider(this.donuts, this.crackerGroup) // collision for donuts and crackers

         // Now that the diamonds have bodies (from the STATIC_BODY part above), we set donutDiamond to off
        this.donutDiamond.setVisible(false);
        this.donutDiamond.body.enable = false;

        

        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (player, coin) => {
            totalScore += 1;
            my.vfx.collect.setPosition(coin.x, coin.y)
            my.vfx.collect.explode();
            this.sound.play('coinSound',{volume: 0.8});
            coin.destroy(); // remove coin on overlap
        });

        // overlap hearts
        this.physics.add.overlap(my.sprite.player, this.heartGroup, (player, heart) => {
            playerHealth += 1;
            my.vfx.collect.setPosition(heart.x, heart.y)
            my.vfx.collect.explode();
            this.sound.play('heartSound');
            heart.destroy(); 
        });

        // overlap diamonds
        this.physics.add.overlap(my.sprite.player, this.diamondGroup, (player, diamond) => {
            totalScore += 100;
            my.vfx.collect.setPosition(diamond.x, diamond.y)
            my.vfx.collect.explode();
            totalDiamonds += 1;
            this.sound.play('diamondSound');
            diamond.destroy(); 
        });


         // overlap keys
        this.physics.add.overlap(my.sprite.player, this.keysGroup, (player, key) => {
            this.sound.play('diamondSound');
            this.hasKey = true
            key.destroy(); 
        });

        // overlap triggers
        this.physics.add.overlap(my.sprite.player, this.triggersGroup, (player, trigger) => {
            if (trigger.name === 'door1') {
                if (my.sprite.player.body.blocked.down && (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(this.wKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey))) {
                    if (this.hasKey === true) {
                        player.x = 2763; // coordinates of door2
                        player.y = 530;
                        this.crackerBlock = true;
                        // Hide the donutBox
                        this.donutBox.hideBox();
                        // bonus room donut
                        if (this.specialDonutHere == false) {
                            this.specialDonut = this.donuts.create(3015, 350, 'donut1').body.setCircle(9);
                            this.specialDonutHere = true;
                            // create collision for special donut
                            this.physics.add.overlap(this.specialDonut, this.spikeGroup, (donut, spike) => {
                                this.specialDonutHere = false;
                                this.donutBox.showBox();
                            });
                            // checks if a donut is hitting donutTrigger. If it is, reveal diamond
                            this.physics.add.overlap(this.specialDonut, this.triggersGroup, (donut, trigger) => {
                                if (trigger.name === 'donutTrigger') {
                                    if (this.hmmPlayed == false) {
                                        this.sound.play('hmmSound', {volume: 0.2});
                                        this.hmmPlayed = true;
                                    }
                                    this.donutDiamond.setVisible(true);
                                    this.physics.world.enable(this.donutDiamond, Phaser.Physics.Arcade.STATIC_BODY); // recreate the diamond collision 

                            }
                            });
                            
                        }
                    }
                    else {
                        this.needKeyBox.showBox();
                    }
                }
            }
            if (trigger.name === 'door2') {
                if (my.sprite.player.body.blocked.down && (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(this.wKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey))) {
                    player.x = 1665;
                    player.y = 530;
                }
            }
        });

        

        // overlap flag or poles
        this.physics.add.overlap(my.sprite.player, this.flagGroup, (player, flag) => {
            if (flag.name === 'flag1') {
                if (this.checkpoint1 == false) {
                    this.sound.play('flagSound', {volume: 0.5});
                    my.vfx.flag.setPosition(flag.x, flag.y)
                    my.vfx.flag.explode();
                }
                this.checkpoint1 = true;
                this.checkpoint2 = false;
                this.checkpoint4 = false;
                this.currentCheckpoint = flag;
            }
            else if (flag.name === 'flag2') {
                if (this.checkpoint2 == false) {
                    this.sound.play('flagSound', {volume: 0.5});
                    my.vfx.flag.setPosition(flag.x, flag.y)
                    my.vfx.flag.explode();
                }
                this.checkpoint2 = true;
                this.checkpoint1 = false;
                this.checkpoint4 = false;
                this.currentCheckpoint = flag;
            }
            else if (flag.name === 'flag3' || flag.name === 'pole') {
                win = true;
                this.scene.start('End');
            }
            else if (flag.name === 'flag4') {
                if (this.checkpoint4 == false) {
                    this.sound.play('flagSound', {volume: 0.5});
                    my.vfx.flag.setPosition(flag.x, flag.y)
                    my.vfx.flag.explode();
                }
                this.checkpoint4 = true;
                this.checkpoint2 = false;
                this.checkpoint1 = false;
                this.currentCheckpoint = flag;
            }
        });
    
        
        // overlap spike
        this.physics.add.overlap(my.sprite.player, this.spikeGroup, (player, spike) => {
            this.sound.play('hurtSound', {volume: 0.2});
            if (this.hurtTimer < 0) {
                playerHealth -= 1;
                this.hurtTimer = 1500;
            }
            this.isDead = true;
            my.sprite.player.body.setVelocity(0, 0);
            console.log(playerHealth);
            if (this.currentCheckpoint != 0) {
                my.sprite.player.x = this.currentCheckpoint.x
                my.sprite.player.y = this.currentCheckpoint.y - 10
            }
            else {
                my.sprite.player.x = 17
                my.sprite.player.y = 528 - 10;
            }    
            this.isDead = false;
        });

    

        // collides block
        this.physics.add.collider(my.sprite.player, this.blockGroup, (player, block) => { // Changed to collider instead of overlap since we don't want them to overlap, only collide
            if (player.y > block.y) {
                this.sound.play('clickSound');
                block.body.enable = false; // stops player from interrupting tween by turning off block's body completely
               
                this.tweens.add({
                    targets: block,
                    y: "-=5",
                    duration: 50,
                    ease: 'Sine.easeOut',
                    yoyo: true,
                    onComplete: () => {
                        if (this.crackerBlock == false) {
                            this.crackerBlock = true;
                        }
                        else {
                            this.crackerBlock = false;
                        }  
                        block.body.enable = true;
                    }
                })
            }
        });





        // play animations for coins
        for (let i = 0; i < this.coins.length; i ++) {
            this.coins[i].anims.play('coinAnim');
        }
        // play anim for flags
        for (let i = 0; i < this.flags.length; i++) {
            if (this.flags[i].name !== 'pole') {
                this.flags[i].anims.play('flagAnim');
            }
        }
        // play anim for candles
        for (let i = 0; i < this.candles.length; i++) {
            if (this.candles[i].name == 'red') {
                this.candles[i].anims.play('redCandleAnim');
            }
            else {
                this.candles[i].anims.play('blueCandleAnim');
            }
        }
        // create tweens for diamonds and hearts
        for (let i = 0; i < this.hearts.length; i++) {
            this.tweens.add({
                targets: [this.hearts[i], this.diamonds[i]],
                y: "-= 5",
                duration: 1000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        }
        // create tween for key
        for (let i = 0; i < this.keys.length; i++) {
            this.tweens.add({
                targets: [this.keys[i]],
                y: "-= 5",
                duration: 1000,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
        }
        // make tween and apply it to movingLayer
        this.tweens.add({
                    targets: this.movingLayer,
                    x: "+=150",
                    duration: 1500,
                    ease: 'Sine.easeInOut',
                    yoyo: true,
                    repeat: -1
        
        });
        


        // Put score on screen
        this.scoreText = this.add.text(252, 150, `Score: ${totalScore}`, {
                fontSize: '18px',
                fill: '#444A5F'
        });
        this.scoreText.setScrollFactor(0); // arg means moves at 0% speed relative to cam. Ignores cam movement


        // add HUD sprites
        my.sprite.heartHUD1 = this.add.sprite(642, 158, 'heartFull').setScrollFactor(0); 
        my.sprite.heartHUD2 = this.add.sprite(627, 158, 'heartFull').setScrollFactor(0); // x is -15 between hearts
        my.sprite.heartHUD3 = this.add.sprite(612, 158, 'heartFull').setScrollFactor(0); 
        my.sprite.heartHUD4 = this.add.sprite(597, 158, 'heartFull').setScrollFactor(0); 
        my.sprite.heartHUD5 = this.add.sprite(582, 158, 'heartFull').setScrollFactor(0); 
        my.sprite.heartHUD6 = this.add.sprite(567, 158, 'heartFull').setScrollFactor(0); 
        my.sprite.keyHUD = this.add.sprite(639, 170, 'key').setScrollFactor(0);
        my.sprite.keyHUD.visible = false;
    }

    update(time, delta) {
        let dt = delta/1000
        this.hurtTimer -= delta;

        if (!this.physics.overlap(my.sprite.player, this.triggersGroup)) {
            this.needKeyBox.hideBox();
        }


        if(cursors.left.isDown || this.aKey.isDown && this.isDead == false) {
            // have the player accelerate to the left
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

            // vfxs
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-4, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }
            else {
                my.vfx.walking.stop()
            }


        } else if(cursors.right.isDown || this.dKey.isDown && this.isDead == false) {
            // have the player accelerate to the right
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);

            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            // vfxs
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-20, my.sprite.player.displayHeight/2-4, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }
            else {
                my.vfx.walking.stop()
            }

        } else {
            // set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down && this.isDead == false) {
            my.sprite.player.anims.play('jump');

        }
        if(my.sprite.player.body.blocked.down && (Phaser.Input.Keyboard.JustDown(cursors.up) || Phaser.Input.Keyboard.JustDown(this.wKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) && this.isDead == false) {
            // set a Y velocity to have the player "jump" upwards (negative Y direction)
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);      

             //vfxs
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2, false);
            // args for above (target to follow, x offset. /2 gets halfway point of player, y offset. /2 gets middle of player and -5 moves it above ground a little, false means particles will keep emitting even if player hidden temporarily)
            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            // Only play smoke effect if touching the ground
            my.vfx.jumping.explode();
        }

       

        // make player move with platform when on it
        if(this.riding == true) {
            my.sprite.player.body.x += (this.movingLayer.x - this.movingLayerPrevX) // finds how much platform has moved since the previous tick. Adds that amount of movement to the player so it moves just as much as the platform
        }
    

        for (let donut of this.donuts.getChildren()) { // getChildren() lets us get each donut. You can't iterate through it normally cause it's a Phaser Group
            donut.body.angularVelocity = donut.body.velocity.x*5 // angular velocity is how fast it is rotating at a given moment. 

        }


        if (this.crackerBlock == true) {
            for (let cracker of this.crackers) {
                cracker.setAlpha(1);
                this.crackerCollider.active = true;
                this.crackerCollider2.active = true;
            }
        }
        else {
            for (let cracker of this.crackers) {
                cracker.setAlpha(0.3)
                this.crackerCollider.active = false;
                this.crackerCollider2.active = false;
            }
        }

        // Update the riding check
        this.riding = false;


        // Update score text 
        this.scoreText.setText(`Score: ${totalScore}`);


     


        // Update HUD lives
        if (playerHealth == 6) {
            my.sprite.heartHUD1.visible = true;
            my.sprite.heartHUD2.visible = true;
            my.sprite.heartHUD3.visible = true;
            my.sprite.heartHUD4.visible = true;
            my.sprite.heartHUD5.visible = true;
            my.sprite.heartHUD6.visible = true;
        }
        else if (playerHealth == 5) {
            my.sprite.heartHUD1.visible = true;
            my.sprite.heartHUD2.visible = true;
            my.sprite.heartHUD3.visible = true;
            my.sprite.heartHUD4.visible = true;
            my.sprite.heartHUD5.visible = true;
            my.sprite.heartHUD6.visible = false;
        }
        else if (playerHealth == 4) {
            my.sprite.heartHUD1.visible = true;
            my.sprite.heartHUD2.visible = true;
            my.sprite.heartHUD3.visible = true;
            my.sprite.heartHUD4.visible = true;
            my.sprite.heartHUD5.visible = false;
            my.sprite.heartHUD6.visible = false;
        }
        else if (playerHealth == 3) {
            my.sprite.heartHUD1.visible = true;
            my.sprite.heartHUD2.visible = true;
            my.sprite.heartHUD3.visible = true;
            my.sprite.heartHUD4.visible = false;
            my.sprite.heartHUD5.visible = false;
            my.sprite.heartHUD6.visible = false;
        }
        else if (playerHealth == 2) {
            my.sprite.heartHUD1.visible = true;
            my.sprite.heartHUD2.visible = true;
            my.sprite.heartHUD3.visible = false;
            my.sprite.heartHUD4.visible = false;
            my.sprite.heartHUD5.visible = false;
            my.sprite.heartHUD6.visible = false;


        }
        else if (playerHealth == 1) {
            my.sprite.heartHUD1.visible = true;
            my.sprite.heartHUD2.visible = false;
            my.sprite.heartHUD3.visible = false;
            my.sprite.heartHUD4.visible = false;
            my.sprite.heartHUD5.visible = false;
            my.sprite.heartHUD6.visible = false;

        }
        else if (playerHealth == 0) {
            my.sprite.heartHUD1.visible = false;
            my.sprite.heartHUD2.visible = false;
            my.sprite.heartHUD3.visible = false;
            my.sprite.heartHUD4.visible = false;
            my.sprite.heartHUD5.visible = false;
            my.sprite.heartHUD6.visible = false;

        }
        if (this.hasKey == true) {
            my.sprite.keyHUD.visible = true;
        }

         // Check if level should end
        if(playerHealth <= 0) {
            this.scene.start("End");
        }
        
        this.movingLayerPrevX = this.movingLayer.x; // constantly gets current x of the moving layer at the end of the update cycle to be used to find difference in movement per tick


    }
}