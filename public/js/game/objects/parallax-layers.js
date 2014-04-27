/* parallax-layers.js */
define(
    [
        'Phaser',
        'game/settings/settings',
        'game/managers/memory'
    ],
    function(Phaser, Settings, Memory) {
        'use strict';

        function ParallaxLayers(game) {
            this.game = game;
            this.layers = [];
        }

        ParallaxLayers.prototype.init = function(group) {
            this.currentLevel = Settings.levels[Memory.getCurrentLevel()];
            this.layerSettings = this.currentLevel.parallaxLayers;
            this.createLayers(group);
        };

        ParallaxLayers.prototype.updateScrolling = function(baseScrollingSpeedX, baseScrollingSpeedY) {
            var l = this.layers.length,
                view = this.game.camera.view,
                layer;

            for(var i = 0; i < l; i++) {
                layer = this.layers[i];
                //layer.x = view.x; //~~this.game.camera.view.x;
               // layer.y = view.y;
                layer.tilePosition.x -= baseScrollingSpeedX * this.layerSettings[i].scrollingSpeed.x;
                layer.tilePosition.y -= baseScrollingSpeedY * this.layerSettings[i].scrollingSpeed.y;
            }
        };

        ParallaxLayers.prototype.createLayers = function(group) {
            var l = this.layerSettings.length,
                layerSetting,
                layerSprite;

            for(var i = 0; i < l; i++) {

                layerSetting = this.layerSettings[i];
                //console.log(layerSettings.assetKey);
                layerSprite = this.layers[this.layers.length] = this.game.add.tileSprite(
                    layerSetting.dimensions.x,
                    layerSetting.dimensions.y,
                    layerSetting.dimensions.w,
                    layerSetting.dimensions.h,
                    layerSetting.assetKey,
                    1,
                    group
                );
                layerSprite.fixedToCamera = layerSetting.fixedToCamera;
                //layerSprite.name = layerSetting.assetKey;
                //layerSprite.generateTilingTexture(true);
                //layerSprite.inFrontOfAction = layerSetting.inFrontOfAction;
            }
        };

        ParallaxLayers.prototype.sort = function(group) {
            for(var i = 0; i < this.layers.length; i++) {
                if(this.currentLevel.parallaxLayers[i].inFrontOfAction) {
                    group.bringToTop(this.layers[i]);
                }
            }
        };

        ParallaxLayers.prototype.destroy = function() {
            for(var i = 0; i < this.layers.length; i++) {
                this.layers[i].destroy();
            }
            this.layers = null;
        };

        return ParallaxLayers;
    }
);