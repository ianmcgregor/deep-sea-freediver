/* boot.js */
define(
    [
        'Phaser',
        'game/settings/settings',
        'game/utils/loader',
        'game/plugins/screen-shake',
        'game/managers/memory'
    ],
    function(Phaser, Settings, Loader, ScreenShake, Memory) {
        'use strict';

        function Boot(game) {
            Phaser.State.call(this, game);
        }

        Boot.prototype = Object.create(Phaser.State.prototype);
        Boot.prototype.constructor = Boot;

        Boot.prototype.init = function() {

            this.game.input.maxPointers = 1;
            this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.game.scale.pageAlignHorizontally = true;
            this.game.scale.pageAlignVertically = true;
            this.game.scale.minWidth = Settings.game.width*0.5;
            this.game.scale.minHeight = Settings.game.height*0.5;
            this.game.scale.maxWidth = Settings.game.width*2;
            this.game.scale.maxHeight = Settings.game.height*2;
            this.game.scale.refresh();
            //this.game.scale.hasResized.add(this.resize, this);
            this.resize(this.game.scale.width, this.game.scale.height);

            var screenShake = this.game.plugins.add(ScreenShake);
            this.game.plugins.screenShake = screenShake;

            if(Settings.game.mute){
                Memory.setSoundOn(false);
            }
        };

        Boot.prototype.preload = function() {
            var loader = new Loader();
            loader.queueAssets(this.game, Settings.assets.boot);
        };

        Boot.prototype.create = function() {
            this.initOrientation();
            this.game.stage.backgroundColor = Settings.game.backgroundColor;
            this.game.state.start('Preloader');
        };

        Boot.prototype.initOrientation = function() {
            if(Settings.game.device.desktop) {
                return;
            }
            this.game.scale.enterIncorrectOrientation.add(this.changeOrientation, this);
            this.game.scale.leaveIncorrectOrientation.add(this.changeOrientation, this);
            this.game.scale.forceOrientation(true, false);
            this.game.scale.checkOrientationState();
        };

        Boot.prototype.changeOrientation = function() {
            if(this.game.scale.incorrectOrientation){
                document.documentElement.classList.add('rotation');
            }
            else {
                document.documentElement.classList.remove('rotation');
            }
        };

        Boot.prototype.resize = function(width, height) {
            /*function marginToNumber(margin){
                return Number(margin.replace('px',''));
            }
            var scale = Math.min(width/1280, height/610);

            var xOffset = marginToNumber(this.game.canvas.style.marginLeft);
            var yOffset = marginToNumber(this.game.canvas.style.marginTop);

            var el;
            for(var id in this.dynamicDivs){
                el = document.getElementById(id);
                if(el === undefined){
                    console.log('Cant find div with id:'+id);
                }else{
                    el.style.webkitTransform = 'scale('+scale+','+scale+')';
                    el.style.left = ((xOffset + this.dynamicDivs[id].x*scale))+'px';
                    el.style.top = ((yOffset + this.dynamicDivs[id].y*scale))+'px';
                    el.style.webkitTransformOrigin = '0 0';
                }
            }*/
        };

        return Boot;
    }
);