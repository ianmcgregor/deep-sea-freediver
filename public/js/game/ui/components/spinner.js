/* spinner.js */
define(
    [
        'Phaser',
        'game/settings/settings'
    ],
    function(Phaser, Settings) {
        'use strict';

        function Spinner(game) {
            Phaser.Sprite.call(this, game, 0, 0, 'loader', 'loader_a0001');
            this.x = (game.width - this.width) * 0.5;
            this.y = (game.height - this.height) * 0.5;

            this.animations.add('spin', Phaser.Animation.generateFrameNames('loader_a', 1, 12, '', 4), 12, true);
            this.animations.play('spin');
        }

        Spinner.prototype = Object.create(Phaser.Sprite.prototype);
        Spinner.prototype.constructor = Spinner;

        Spinner.prototype.setProgress = function(progress) {
            //progress = ((progress<0) ? 0 : progress)*0.01;
        };

        return Spinner;
    }
);