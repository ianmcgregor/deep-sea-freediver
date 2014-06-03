define(
    [
        'Phaser'
    ],
    function(Phaser) {
        'use strict';

        function Oyster(game, x, y, key, frame) {
            Phaser.Sprite.call(this, game, x, y, key, frame);

            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.allowGravity = false;
            this.body.immovable = true;
            this.points = 2000;
        }

        Oyster.prototype = Object.create(Phaser.Sprite.prototype);
        Oyster.prototype.constructor = Oyster;

        return Oyster;
    }
);
