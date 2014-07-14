/* hero.js */
define(
    [
        'Phaser',
        'game/settings/settings',
        'game/managers/memory',
        'game/managers/audio',
        'game/managers/controls'
    ],
    function(Phaser, Settings, Memory, Audio, Controls) {
        'use strict';

        function Hero(game) {
            Phaser.Sprite.call(this, game, Settings.hero.initialPosition.x, Settings.hero.initialPosition.y, 'textures', 'hero_stand_b');
        }

        Hero.prototype = Object.create(Phaser.Sprite.prototype);
        Hero.prototype.constructor = Hero;

        Hero.prototype.init = function() {
            this.name = 'hero';

            this.collisions = {};
            this.collided = new Phaser.Signal();
        };

        Hero.prototype.create = function() {
            this.reset(Settings.hero.initialPosition.x, Settings.hero.initialPosition.y);

            this.createAnimations();

            this.initialisePhysics();

            this.game.camera.follow(this.body); /* seems to work if we use the body and not the sprite */

            this.downCameraDeadZone();

            this.resetState();

            this.exists = true;
            this.alive = true;

            this.anchor.x = 0.5;
            this.anchor.y = 0.5;

            this.setInitialState();
        };

        Hero.prototype.setInitialState = function() {
            this.reset(Settings.hero.initialPosition.x, Settings.hero.initialPosition.y);
            this.frameName = 'hero_stand_b';
            this.swimming = false;
            this.onBoat = false;
            this.direction = 1;
            this.scale.y = this.direction;
            this.downCameraDeadZone();
        };

        Hero.prototype.update = function() {
            this.checkCollisions();

            var up = Controls.upIsPressed() || Controls.isSwipedUp() || Controls.isTiltedUp(),
                down = Controls.downIsPressed() || Controls.isSwipedDown() || Controls.isTiltedDown();

            if(this.direction === 1) {
                this.treadingWater = up;
                this.boost = down;
            }
            else {
                this.treadingWater = down;
                this.boost = up;
            }

            if(!this.swimming && !this.onBoat && this.y > 128) {
                this.swimming = true;
                this.frameName = 'hero_swim_b';
            }
            if(this.swimming && this.treadingWater) {
                this.body.velocity.y = 50 * this.direction;
            }
            else if(this.swimming && this.boost) {
                this.body.velocity.y = 400 * this.direction;
            }
            else {
                this.body.velocity.y = 200 * this.direction;
            }
        };

        Hero.prototype.postUpdate = function() {
            Phaser.Sprite.prototype.postUpdate.call(this);
        };

        Hero.prototype.resetState = function() {
            this.exists = false;
            this.isPaused = false;
            this.alive = true;
        };

        /*
         * Collisions
         */

        Hero.prototype.checkCollisions = function() {
            this.game.physics.arcade.collide(this, this.collisions.ground, this.onGroundCollision, this.testGroundCollision, this);
            this.game.physics.arcade.collide(this, this.collisions.sky, this.onSkyCollision, this.testSkyCollision, this);
            this.game.physics.arcade.collide(this, this.collisions.platforms);
            this.body.checkCollision.left = false;
            this.body.checkCollision.right = false;
            this.onBoat = this.game.physics.arcade.collide(this, this.collisions.boat);
            this.body.checkCollision.left = true;
            this.body.checkCollision.right = true;
            this.game.physics.arcade.overlap(this, this.collisions.hazards, this.onHazardCollision, null, this);
            this.game.physics.arcade.overlap(this, this.collisions.collectables, this.onCollectableCollision, null, this);
        };

        Hero.prototype.testGroundCollision = function() {
            if(this.direction === -1) {
                return false;
            }
            return true;
        };

        Hero.prototype.onGroundCollision = function() {
           this.direction = -1;
           this.scale.y = this.direction;
           this.upCameraDeadZone();
        };

        Hero.prototype.testSkyCollision = function() {
            if(this.direction === 1) {
                return false;
            }
            return true;
        };

        Hero.prototype.onSkyCollision = function() {
            this.direction = 1;
            this.scale.y = this.direction;
            this.downCameraDeadZone();
            this.setInitialState();
            this.collided.dispatch('sky');
        };

        Hero.prototype.onHazardCollision = function(hero, hazard) {
            hazard.kill();
            this.collided.dispatch('hazard', hazard);
        };

        Hero.prototype.onCollectableCollision = function(hero, collectable) {
            collectable.kill();
            this.collided.dispatch('collectable', collectable);
        };

        /*
         * Initialisation
         */

        Hero.prototype.initialisePhysics = function() {
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            this.body.collideWorldBounds = true;
            this.body.allowRotation = false;
            this.body.allowGravity = true;
            this.body.mass = Settings.hero.mass;
            this.body.gravity.y = Settings.world.gravity.y;
            this.body.velocity.x = 0;
            this.body.velocity.y = 0;
            this.body.drag.x = 800;
        };

        Hero.prototype.createAnimations = function() {
            //this.animations.add('running', Phaser.Animation.generateFrameNames('hero', 1, 10, '', 4), 12, true);
        };

        Hero.prototype.playAnimation = function(animationKey) {
            this.animations.play(animationKey);
            this.animations.refreshFrame();
        };

        /*
         * Camera dead zones
         */

        Hero.prototype.downCameraDeadZone = function() {
            var deadzone = Settings.camera.deadzones.down;
            this.setCameraDeadZone(deadzone.x, deadzone.y, deadzone.w, deadzone.h);
        };

        Hero.prototype.upCameraDeadZone = function() {
            var deadzone = Settings.camera.deadzones.up;
            this.setCameraDeadZone(deadzone.x, deadzone.y, deadzone.w, deadzone.h);
        };

        Hero.prototype.setCameraDeadZone = function(x, y, w, h) {
            if(this.game.camera.deadzone === null) {
                this.game.camera.deadzone = new Phaser.Rectangle();
            }
            this.game.camera.deadzone.x = x || 0;
            this.game.camera.deadzone.y = y || 0;
            this.game.camera.deadzone.width = w || this.game.width;
            this.game.camera.deadzone.height = h || this.game.height;
        };

        /*
         * Actions
         */
        Hero.prototype.up = function() {
        };

        Hero.prototype.down = function() {
        };

        Hero.prototype.left = function() {
            this.scale.x = -1;
            this.body.velocity.x = -400;
        };

        Hero.prototype.right = function() {
            this.scale.x = 1;
            this.body.velocity.x = 400;
        };
        /*
         * pause/resume
         */

        Hero.prototype.pause = function() {
            this.wasMoving = this.body.moves;
            this.body.moves = false;
            this.animations.paused = true;
            this.isPaused = true;
        };

        Hero.prototype.resume = function() {
            this.animations.paused = false;
            this.body.moves = this.wasMoving;
            this.isPaused = false;
        };

        return Hero;
    }
);