define(
    [
        'Phaser',
        'game/settings/settings'
    ],
    function(Phaser, Settings) {
        'use strict';

        function Fish(game, x, y, key, frame) {
            Phaser.Sprite.call(this, game, x, y, key, frame);

            game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.allowGravity = false;
            this.body.setSize(16, 16, 0, 0);

            this.vel = 300 * Settings.game.scale;
            this.direction = 1;
            this.body.velocity.x = this.vel * this.direction;
        	this.anchor.x = 0.5;
            this.anchor.y = 0.5;
        }

        Fish.prototype = Object.create(Phaser.Sprite.prototype);
        Fish.prototype.constructor = Fish;

        Fish.prototype.update = function() {
        	if(this.direction === 1 && this.body.x > this.game.width + this.width) {
        		this.direction = -1;
        		this.body.velocity.x = this.vel * this.direction;
        		this.scale.x = this.direction;
        	}
        	else if(this.direction === -1 && this.body.x < -100) {
        		this.direction = 1;
        		this.body.velocity.x = this.vel * this.direction;
        		this.scale.x = this.direction;
        	}
        };

        return Fish;
    }
);
