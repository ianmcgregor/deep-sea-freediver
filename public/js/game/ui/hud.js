/* hud.js */
define(
    [
        'Phaser',
        'game/settings/settings',
        'game/managers/memory'
    ],
    function(Phaser, Settings, Memory) {
        'use strict';

        function Hud(game) {
            Phaser.Group.call(this, game);
        }

        Hud.prototype = Object.create(Phaser.Group.prototype);
        Hud.prototype.constructor = Hud;

        Hud.prototype.init = function() {
        };

        Hud.prototype.create = function() {
            this.x = this.y = 0;
            this.fixedToCamera = true;

            this.hearts = this.game.add.group(this);
            for(var i = 0; i < Memory.getLivesLeft(); i++) {
                var heart = new Phaser.Image(this.game, this.game.width - 32 - i * 32, 5, 'textures', 'heart');
                this.hearts.add(heart);
            }
            this.hearts.setAll('alive', true);
            //this.hearts.reverse();

            this.score = new Phaser.BitmapText(this.game, 2, 0, Settings.game.font, '', 32);
            this.add(this.score);
        };

        Hud.prototype.lifeLost = function() {
            var heart = this.hearts.getFirstAlive();
            if(heart) {
                heart.alive = false;
                heart.frameName = 'heart_empty';
            }
        };

        Hud.prototype.setScore = function(points, collected, totalCollectables) {
            this.score.text = collected + '/' + totalCollectables; //Phaser.Utils.pad(points.toString(), 8, '0', 1);
        };

        Hud.prototype.soundMuted = function() {
            this.soundToggle.setToggle(this.soundToggle.isOff);
            Memory.setSoundOn(this.soundToggle.isOn);

            this.game.sound.mute = !Memory.soundIsOn();
        };

        Hud.prototype.destroy = function() {
            Phaser.Group.prototype.destroy.apply(this, arguments);
        };

        return Hud;
    }
);