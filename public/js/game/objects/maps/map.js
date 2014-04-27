/* map.js */
define(
    [
        'Phaser',
        'game/settings/settings'
    ],
    function(Phaser, Settings) {
        'use strict';

        function Map(game) {
            this.game = game;
        }

        Map.prototype.init = function() {
            this.layers = {};
        };

        Map.prototype.create = function() {};

        Map.prototype.createTileMapWithName = function(game, name) {
            if(Settings.game.scale !== 1) {
                this.getAndScaleData(game, name);
            }
            var tilemap = game.add.tilemap(name);
            this.addLayer('tilemap', tilemap);
            return tilemap;
        };

        Map.prototype.getAndScaleData = function(game, name) {
            var tilemapData = game.cache.getTilemapData(name);
            if(tilemapData.isScaled) { return; }
            this.scaleTileWidthAndHeight(tilemapData);
            this.scaleTilesets(tilemapData);
            this.scaleObjectLayers(tilemapData);
            tilemapData.isScaled = true;
        };

        Map.prototype.scaleTileWidthAndHeight = function(tilemapData) {
            tilemapData.data.tilewidth *= Settings.game.scale;
            tilemapData.data.tileheight *= Settings.game.scale;
        };

        Map.prototype.scaleTilesets = function(tilemapData) {
            var tilesets = tilemapData.data.tilesets;
            var i = 0,
                len = tilesets.length,
                tileset;
            for(;i<len;++i) {
                tileset = tilesets[i];
                tileset.imageheight *= Settings.game.scale;
                tileset.imagewidth *= Settings.game.scale;
                tileset.tileheight *= Settings.game.scale;
                tileset.tilewidth *= Settings.game.scale;
            }
        };

        Map.prototype.scaleObjectLayers = function(tilemapData) {
            var layers = tilemapData.data.layers;
            var i = 0,
                len = layers.length,
                layer;
            for(;i<len;++i) {
                layer = layers[i];
                if(Object.prototype.toString.call(layer.objects) === '[object Array]') {
                    layer.objects = this.scaleObjects(layer.objects);
                }
            }
        };

        Map.prototype.scaleObjects = function(objects) {
            var i = 0,
                len = objects.length,
                object;
            for(;i<len;++i) {
                object = objects[i];
                object.x *= Settings.game.scale;
                object.y *= Settings.game.scale;
            }
            return objects;
        };

        Map.prototype.destroy = function() {
            var key,
                layer;

            for(key in this.layers) {
                layer = this.layers[key];
                if(layer) {
                    layer.destroy(true, true);
                    this.removeLayer(key);
                }
            }
            this.layers = null;
        };

        Map.prototype.addLayersToGroup = function(group, layerList) {
            var i = 0,
                len = layerList.length,
                key,
                layer;

            for(;i<len;++i) {
                key = layerList[i];
                layer = this.get(key);
                if(layer) {
                    group.add(layer);
                }
            }
        };

        Map.prototype.removeLayersFromStage = function(stage, layerList) {
            var l = layerList.length,
                key,
                layer;
            for(var i = 0; i < l; i++) {
                key = layerList[i];
                layer = this.get(key);
                if(layer) {
                    stage.remove(layer);
                }
            }
        };

        Map.prototype.addLayer = function(key, layer) {
            if(!layer) {
                return;
            }
            layer.name = key;
            this.layers[key] = layer;
        };

        Map.prototype.removeLayer = function(key) {
            this.layers[key] = null;
            delete this.layers[key];
        };

        Map.prototype.get = function(key) {
            return this.layers[key];
        };

        return Map;
    }
);