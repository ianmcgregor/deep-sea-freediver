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
            this.game.stage.backgroundColor = Settings.game.backgroundColor;
            this.game.state.start('Preloader');
        };

        return Boot;
    }
);