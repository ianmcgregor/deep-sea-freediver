/* level-map.js */
define(
    [
        'Phaser',
        'game/settings/settings',
        'game/objects/maps/map',
        'game/objects/fish',
        'game/objects/spiky',
        'game/objects/oyster',
        'game/objects/star'
    ],
    function(Phaser, Settings, Map, Fish, Spiky, Oyster, Star) {
        'use strict';

        function LevelMap(game) {
            Map.call(this, game);
        }

        LevelMap.prototype = Object.create(Map.prototype);
        LevelMap.prototype.constructor = LevelMap;

        LevelMap.prototype.create = function(group) {
            this.group = group;
            this.tilemap = this.createTileMap();
            this.tilemap.addTilesetImage('tiles', 'tiles');
            this.createGround();
            this.createVisuals();
            this.createPlatforms();
            this.createHazards();
            this.createCollectables();
            this.setCollisions();
        };

        LevelMap.prototype.createTileMap = function() {
            return this.createTileMapWithName(this.game, 'map');
        };

        Map.prototype.createGround = function() {
            this.addLayer('ground', this.tilemap.createLayer('ground', undefined, undefined, this.group));
            this.addLayer('sky', this.tilemap.createLayer('sky', undefined, undefined, this.group));
        };

        Map.prototype.createVisuals = function() {
            var visuals = this.tilemap.createLayer('visual', undefined, undefined, this.group);
            visuals.resizeWorld();
            this.addLayer('visual', visuals);
        };

        Map.prototype.createPlatforms = function() {
            this.addLayer('platforms', this.tilemap.createLayer('platforms', undefined, undefined, this.group));
        };

        Map.prototype.createCollectables = function() {
            var collectables = this.game.add.group(this.group, 'collectables', false, true, Phaser.Physics.ARCADE);
            this.tilemap.createFromObjects('collectable', 8, 'textures', 'clam', true, false, collectables, Oyster);
            this.tilemap.createFromObjects('collectable', 13, 'textures', 'star', true, false, collectables, Star);
            this.addLayer('collectables', collectables);
        };

        Map.prototype.createHazards = function() {
            var hazards = this.game.add.group(this.group, 'hazards', false, true, Phaser.Physics.ARCADE);
            this.tilemap.createFromObjects('hazard', 6, 'textures', 'fish', true, false, hazards, Fish);
            this.tilemap.createFromObjects('hazard', 7, 'textures', 'spiky', true, false, hazards, Spiky);
            this.addLayer('hazards', hazards);
        };

        Map.prototype.setCollisions = function() {
            this.tilemap.setCollision(10, true, 'ground');
            this.tilemap.setCollision(11, true, 'platforms');
            this.tilemap.setCollision(12, true, 'platforms');
            this.tilemap.setCollision(5, true, 'sky');
        };

        return LevelMap;
    }
);