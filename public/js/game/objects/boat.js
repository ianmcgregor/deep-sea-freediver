define(
    [
        'Phaser',
        'game/settings/settings'
    ],
    function(Phaser, Settings) {
        'use strict';

        function Boat(game, x, y, key, frame) {
            Phaser.Sprite.call(this, game, x, y, key, frame);

            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.allowGravity = false;
            this.body.immovable = true;
            this.body.setSize(this.width, 22, 0, this.height - 22);
        }

        Boat.prototype = Object.create(Phaser.Sprite.prototype);
        Boat.prototype.constructor = Boat;

        Boat.prototype.update = function() {
        	
        };

        return Boat;
    }
);
