/* controls.js */
define(
    [
        'Phaser',
        'game/settings/settings'
    ],
    function(Phaser, Settings) {
        'use strict';

        /**
         * Manage game input
         */
        function Controls() {}

        Controls.prototype.init = function(game) {
            this.userControlRemoved = false;

            this.game = game;
            this.game.input.tapRate = Settings.controls.tapRate;
            this.game.input.keyboard.addKeyCapture([
                Phaser.Keyboard.SPACEBAR,
                Phaser.Keyboard.UP,
                Phaser.Keyboard.DOWN,
                Phaser.Keyboard.LEFT,
                Phaser.Keyboard.RIGHT,
                Phaser.Keyboard.W,
                Phaser.Keyboard.S,
                Phaser.Keyboard.A,
                Phaser.Keyboard.D
            ]);

            this.swipedUp = false;
            this.swipedDown = false;
            
            //this.debug = new Phaser.BitmapText(this.game, 2, 20, Settings.game.font, 'TILT', 32);
            //this.game.world.add(this.debug);
        
            window.addEventListener('deviceorientation', this.handleOrientation.bind(this), true);
        };

        Controls.prototype.handleOrientation = function(event) {
            var x = event.gamma; // range [-90,90]
            var y = event.beta;  // range [-180,180]

            //this.debug.text = x + ' / ' + y;
            var tiltX = x / 90; // range [-1, 1]
            var tiltY = y / 180; // range [-1, 1]

            this.tiltedUp = tiltY < 0;
            this.tiltedDown = tiltY > 0.2;
            this.tiltedLeft = tiltX < -0.15;
            this.tiltedRight = tiltX > 0.15;
        };

        Controls.prototype.isTiltedDown = function() {
            return this.tiltedDown;
        };

        Controls.prototype.isTiltedUp = function() {
            return this.tiltedUp;
        };

        Controls.prototype.isTiltedLeft = function() {
            return this.tiltedLeft;
        };

        Controls.prototype.isTiltedRight = function() {
            return this.tiltedRight;
        };

        Controls.prototype.update = function() {
            if(this.userControlRemoved) { return; }

            if(this.leftIsPressed() || this.isSwipedLeft() || this.isTiltedLeft()) {
                this.hero.left();
            }
            else if(this.rightIsPressed() || this.isSwipedRight() || this.isTiltedRight()) {
                this.hero.right();
            }
        };

        Controls.prototype.map = function(hero) {
            this.hero = hero;
        };

        Controls.prototype.upIsPressed = function() {
            return this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.W);
        };

        Controls.prototype.downIsPressed = function() {
            return this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || this.game.input.keyboard.isDown(Phaser.Keyboard.S);
        };

        Controls.prototype.leftIsPressed = function() {
            return this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.A);
        };

        Controls.prototype.rightIsPressed = function() {
            return this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D);
        };

        Controls.prototype.isSwipedDown = function() {
            if(!this.game.input.activePointer.isDown) {
                this.swipedDown = false;
            }
            else if(!this.swipedDown) {
                this.swipedDown = (
                    this.game.input.activePointer.isDown &&
                    this.game.input.activePointer.duration > this.game.input.tapRate &&
                    this.game.input.speed.y > 10 );
            }

            if(this.swipedDown) {
                this.swipedUp = false;
            }

            return this.swipedDown;
        };

        Controls.prototype.isSwipedUp = function() {
            if(!this.game.input.activePointer.isDown) {
                this.swipedUp = false;
            }
            else if(!this.swipedUp) {
                this.swipedUp = (
                    this.game.input.activePointer.isDown &&
                    this.game.input.activePointer.duration > this.game.input.tapRate &&
                    this.game.input.speed.y < -10 );
            }

            if(this.swipedUp) {
                this.swipedDown = false;
            }

            return this.swipedUp;
        };

        Controls.prototype.isSwipedLeft = function() {
            return (
                this.game.input.activePointer.isDown &&
                this.game.input.activePointer.duration > this.game.input.tapRate &&
                this.game.input.speed.x < -Settings.controls.swipeThreshold );
        };

        Controls.prototype.isSwipedRight = function() {
            return (
                this.game.input.activePointer.isDown &&
                this.game.input.activePointer.duration > this.game.input.tapRate &&
                this.game.input.speed.x > Settings.controls.swipeThreshold );
        };

        Controls.prototype.spaceIsPressed = function() {
            return this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
        };

        return new Controls();
    }
);