define(
    [
        'Phaser'
    ],
    function(Phaser) {
        'use strict';

        function Spiky(game, x, y, key, frame) {
            Phaser.Sprite.call(this, game, x, y, key, frame);

            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.allowGravity = false;
            this.body.setSize(32, 32, 0, 0);
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            this.origin = new Phaser.Point(x, y);
            this.a = 0;
            this.r = 200;
        }

        Spiky.prototype = Object.create(Phaser.Sprite.prototype);
        Spiky.prototype.constructor = Spiky;

        Spiky.prototype.update = function() {
            this.x = this.origin.x + Math.cos(this.a) * this.r;
            this.y = this.origin.y + Math.sin(this.a) * this.r;
            this.a += 0.01;
        };

        return Spiky;
    }
);
