/* level.js */
define(
    [
        'Phaser',
        'game/settings/settings',
        'game/managers/memory',
        'game/objects/maps/level-map',
        'game/ui/hud',
        'game/objects/hero',
        'game/managers/controls',
        'game/objects/parallax-layers',
        'game/objects/boat',
        'game/managers/audio'
    ],
    function(Phaser, Settings, Memory, LevelMap, Hud, Hero, Controls, ParallaxLayers, Boat, Audio) {
        'use strict';

        function Level(game) {
            Phaser.State.call(this, game);
        }

        Level.prototype = Object.create(Phaser.State.prototype);
        Level.prototype.constructor = Level;

        Level.prototype.init = function() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.time.deltaCap = Settings.world.maxDeltaTime;

            this.levelGroup = this.game.add.group();

            this.parallaxLayers = new ParallaxLayers(this.game);
            this.parallaxLayers.init(this.levelGroup);

            this.map = new LevelMap(this.game);
            this.map.init();

            this.hero = new Hero(this.game);
            this.hero.init();

            this.boat = new Boat(this.game, 64, 98, 'textures', 'boat_b');

            this.hud = new Hud(this.game);
            this.hud.init();

            Controls.init(this.game);
            Controls.map(this.hero);

            Memory.resetGame(Settings.hero.lives);
        };

        Level.prototype.create = function() {
            this.map.create(this.levelGroup);

            this.hero.collisions.ground = this.map.get('ground');
            this.hero.collisions.sky = this.map.get('sky');
            this.hero.collisions.sky.alpha = 0;
            this.hero.collisions.collectables = this.map.get('collectables');
            this.hero.collisions.hazards = this.map.get('hazards');
            this.hero.collisions.platforms = this.map.get('platforms');
            this.hero.collisions.boat = this.boat;
            this.hero.create();
            this.levelGroup.add(this.hero);
            this.hero.collided.add(this.onHeroCollision, this);
            //this.levelGroup.bringToTop(this.hero);

            this.levelGroup.add(this.boat);
            this.levelGroup.sendToBack(this.boat);
            this.levelGroup.moveUp(this.boat);
            this.levelGroup.moveUp(this.boat);
            this.levelGroup.moveUp(this.boat);

            this.hud.create();

            Memory.setTotalCollectables(this.map.get('collectables').length);
            this.updateHud();
        };

        Level.prototype.update = function() {
            var speed = 4 + Math.abs(this.hero.body.velocity.y / 12);
            this.parallaxLayers.updateScrolling(speed, speed);

            Controls.update(this.game);
        };

        Level.prototype.reset = function() {
            this.map.get('hazards').forEachDead(function(item) {
                item.revive();
            }, this);
        };

        Level.prototype.render = function() {
            if(Settings.game.debug) {
                var game = this.game;
                
                game.debug.body(this.hero, '#ff0000');
                if(this.hero.collisions) {
                    if(this.hero.collisions.hazards) {
                        this.hero.collisions.hazards.forEach(function(item) {
                            game.debug.body(item, '#0000ff');
                        }, this);
                    }
                    if(this.hero.collisions.collectables) {
                        this.hero.collisions.collectables.forEach(function(item) {
                            game.debug.body(item, '#0000ff');
                        }, this);
                    }
                    if(this.hero.collisions.boat) {
                        game.debug.body(this.hero.collisions.boat, '#0000ff');
                    }
                }
            }
        };

        Level.prototype.onHeroCollision = function(type, obj) {
            switch(type){

                case 'hazard':
                    this.game.plugins.screenShake.start(20);
                    Memory.addScore(-100);
                    Memory.takeLife();
                    this.hud.lifeLost();
                    Audio.sfx('hit');

                    if(Memory.getLivesLeft() < 0) {
                        this.game.state.start('GameOver');
                    }
                    break;
                case 'collectable':
                    Memory.addScore(obj.points);
                    Audio.sfx('collect');
                    if(obj.points > 500) {
                        Audio.sfx('collect', 200);
                        Audio.sfx('collect', 400);
                    }
                    Memory.addCollected();
                    break;
                case 'sky':
                    this.reset();
                    if(Memory.allCollected()) {
                        Controls.userControlRemoved = true;
                        this.hero.body.collideWorldBounds = false;
                        this.game.add.tween(this.boat)
                            .to({x: this.boat.x + 500}, 5000, Phaser.Easing.Linear.None, true);
                        this.game.add.tween(this.hero)
                            .to({x: this.hero.x + 500}, 5000, Phaser.Easing.Linear.None, true)
                            .onComplete.add(this.gameWon, this);
                    }
                    break;
            }
            this.updateHud();
        };

        Level.prototype.updateHud = function() {
            this.hud.setScore(Memory.getScore(), Memory.getCollected(), Memory.getTotalCollectables());
        };

        Level.prototype.gameWon = function() {
            this.game.state.start('GameWon');
        };

        Level.prototype.shutdown = function() {
            this.levelGroup.destroy();
            this.level = null;
            this.hud.destroy();
            this.hud = null;
        };

        return Level;
    }
);