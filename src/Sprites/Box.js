class Box extends Phaser.GameObjects.Sprite {
        constructor(scene, x, y, texture, frame, key, line1,  line2 = null, line3 = null, line4 = null, score = null, level = null) {
            super(scene, x, y, texture, frame);

            this.key = key;
            this.texture = texture;
            this.x = x;
            this.y = y;
            this.line1 = line1;
            this.line2 = line2;
            this.line3 = line3;
            this.score = score;
            this.level = level;
            this.line4 = line4

            scene.add.existing(this); // Only has one line. Small box
            if (this.key == 1) {
                this.setScale(0.4);
                this.createBox();
            }
            if (this.key == 2) { // Has three lines. Big box
                this.setScale(0.3);
                this.bigBox();

            }
            if (this.key == 3) {  // Score box win
                this.setScale(1.5);
                this.scoreBoxWin();
            } 
            if (this.key == 4) {  // Score box fail
                this.setScale(1.5);
                this.scoreBoxFail();
            } 
        }


        createBox() {        
            this.text1 = this.scene.add.text(this.x, this.y, this.line1, {
                fontSize: '15px',
                fill: '#534200'
            });
            this.text1.setOrigin(0.5); // By default, text has origin at (0, 0) so we have to change that


        }
       


        bigBox() {  
            this.text1 = this.scene.add.text(this.x, this.y - 20, this.line1, {
                fontSize: '12px',
                fill: '#534200'
            });      

            this.text2 = this.scene.add.text(this.x, this.y, this.line2, {
                fontSize: '12px',
                fill: '#534200'
            });    
            this.text3 = this.scene.add.text(this.x, this.y + 20, this.line3, {
                fontSize: '12px',
                fill: '#534200'
            });  
            this.text1.setOrigin(0.5); // By default, text has origin at (0, 0) so we have to change that
            this.text2.setOrigin(0.5);     
            this.text3.setOrigin(0.5);           
      


        }  


         scoreBoxWin() {  
            this.text1 = this.scene.add.text(this.x, this.y - 100, `Great Job!`, {
                fontSize: '32px',
                fill: '#534200'
            });      

            this.text2 = this.scene.add.text(this.x, this.y - 30, `You found ${totalDiamonds}/3 diamonds`, {
                fontSize: '24px',
                fill: '#534200'
            });      
            this.text3 = this.scene.add.text(this.x, this.y + 10, `Heart bonus: +${playerHealth * 100} points`, {
                fontSize: '24px',
                fill: '#534200'
            });
            this.text4 = this.scene.add.text(this.x, this.y + 50, `Total score: ${totalScore + (playerHealth*100)}`, {
                fontSize: '24px',
                fill: '#534200'
            });
            this.text5 = this.scene.add.text(this.x, this.y + 135, "Press SPACE to play again", {
                fontSize: '24px',
                fill: '#9b8014'
            });
            this.text1.setOrigin(0.5); // By default, text has origin at (0, 0) so we have to change that
            this.text2.setOrigin(0.5);
            this.text3.setOrigin(0.5);
            this.text4.setOrigin(0.5);
            this.text5.setOrigin(0.5);

        }  


        scoreBoxFail() {  
            this.text1 = this.scene.add.text(this.x, this.y - 100, `You can do it!`, {
                fontSize: '32px',
                fill: '#534200'
            });      

            this.text2 = this.scene.add.text(this.x, this.y - 30, `You found ${totalDiamonds}/3 diamonds`, {
                fontSize: '24px',
                fill: '#534200'
            });      
            this.text3 = this.scene.add.text(this.x, this.y + 10, `Heart bonus: +${playerHealth * 100} points`, {
                fontSize: '24px',
                fill: '#534200'
            });
            this.text4 = this.scene.add.text(this.x, this.y + 50, `Total score: ${totalScore + (playerHealth*100)}`, {
                fontSize: '24px',
                fill: '#534200'
            });
            this.text5 = this.scene.add.text(this.x, this.y + 135, "Press SPACE to try again", {
                fontSize: '24px',
                fill: '#9b8014'
            });
            this.text1.setOrigin(0.5); // By default, text has origin at (0, 0) so we have to change that
            this.text2.setOrigin(0.5);
            this.text3.setOrigin(0.5);
            this.text4.setOrigin(0.5);
            this.text5.setOrigin(0.5);



        }  



        destroyBox() {
            if (this.text1) {
                this.text1.destroy()
            }
            if (this.text2) {
                this.text2.destroy()
            }
            if (this.text3) {
                this.text3.destroy()
            }
            if (this.text4) {
                this.text4.destroy()
            }
            if (this.text5) {
                this.text5.destroy()
            }
            this.destroy();
        }

        hideBox() {
            this.visible = false;
            if (this.text1) {this.text1.visible = false;}
            if (this.text2) {this.text2.visible = false;}
            if (this.text3) {this.text3.visible = false;}
            if (this.text4) {this.text4.visible = false;}
            if (this.text5) {this.text5.visible = false;}
        }

        showBox() {
            this.visible = true;
            if (this.text1) {this.text1.visible = true;}
            if (this.text2) {this.text2.visible = true;}
            if (this.text3) {this.text3.visible = true;}
            if (this.text4) {this.text4.visible = true;}
            if (this.text5) {this.text5.visible = true;}
        }



        update() {}
        
    }

