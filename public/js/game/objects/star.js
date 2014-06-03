define(
    [
        'Phaser'
    ],
    function(Phaser) {
        'use strict';

        function Star(game, x, y, key, frame) {
            Phaser.Sprite.call(this, game, x, y, key, frame);

            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.allowGravity = false;
            this.body.immovable = true;

            this.points = 500;

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            this.origin = new Phaser.Point(x, y);
            this.a = 0;
            this.r = 16;
        }

        Star.prototype = Object.create(Phaser.Sprite.prototype);
        Star.prototype.constructor = Star;

        Star.prototype.update = function() {
            this.x = this.origin.x + Math.cos(this.a) * this.r;
            this.y = this.origin.y + Math.sin(this.a) * this.r;
            this.a += 0.1;
        };

        return Star;
    }
);
