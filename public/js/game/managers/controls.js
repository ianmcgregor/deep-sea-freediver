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
        };

        Controls.prototype.update = function() {
            if(this.userControlRemoved) { return; }

            if(this.leftIsPressed() || this.isSwipedLeft()) {
                this.hero.left();
            }
            else if(this.rightIsPressed() || this.isSwipedRight()) {
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