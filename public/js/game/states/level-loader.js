/* level-loader.js */
define(
    [
        'Phaser',
        'game/settings/settings',
        'game/managers/memory',
        'game/utils/loader'
    ],
    function(Phaser, Settings, Memory, Loader) {
        'use strict';

        function LevelLoader(game) {
            Phaser.State.call(this, game);
        }

        LevelLoader.prototype = Object.create(Phaser.State.prototype);
        LevelLoader.prototype.constructor = LevelLoader;

        LevelLoader.prototype.init = function() {
            this.loader = new Loader(this.game);
            this.loader.init(this.game);
        };

        LevelLoader.prototype.preload = function() {
            this.loader.addLoaderView(this.game);

            var level = Memory.getCurrentLevel();
            var json = Settings.assets.levels[level];
            this.loader.queueAssets(this.game, json);
        };

        LevelLoader.prototype.create = function() {
            this.loader.removeLoaderView();

            this.game.state.start('Level');
        };

        LevelLoader.prototype.shutdown = function() {
            this.loader.destroy();
        };

        return LevelLoader;
    }
);