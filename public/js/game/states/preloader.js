/* preloader.js */
define(
    [
        'Phaser',
        'game/settings/settings',
        'game/utils/loader'
    ],
    function(Phaser, Settings, Loader) {
        'use strict';

        function Preloader(game) {
            Phaser.State.call(this, game);
        }

        Preloader.prototype = Object.create(Phaser.State.prototype);
        Preloader.prototype.constructor = Preloader;

        Preloader.prototype.init = function() {
            this.loader = new Loader();
            this.loader.init(this.game);
        };

        Preloader.prototype.preload = function() {
            this.loader.addLoaderView(this.game);
            this.loader.queueAssets(this.game, Settings.assets.preloader);
        };

        Preloader.prototype.create = function() {
            this.game.state.start('MainMenu', true, false);
        };

        Preloader.prototype.shutdown = function() {
            this.loader.destroy();
        };

        return Preloader;
    }
);