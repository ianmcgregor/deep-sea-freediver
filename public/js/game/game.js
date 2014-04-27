/* game.js */
define(
    [
        'Phaser',
        'game/settings/settings',
        'game/managers/memory',
        'game/states/boot',
        'game/states/preloader',
        'game/states/main-menu',
        'game/states/level-loader',
        'game/states/level',
        'game/states/game-over',
        'game/states/game-won'
    ],
    function(Phaser, Settings, Memory, Boot, Preloader, MainMenu, LevelLoader, Level, GameOver, GameWon) {
        'use strict';

        function createGame() {
            return new Phaser.Game(Settings.game.width, Settings.game.height, Settings.game.renderer, Settings.game.id);
        }

        function setupStates(game) {
            Memory.reset();
            
            game.state.add('Boot', Boot);
            game.state.add('Preloader', Preloader);
            game.state.add('MainMenu', MainMenu);
            game.state.add('LevelLoader', LevelLoader);
            game.state.add('Level', Level);
            game.state.add('GameOver', GameOver);
            game.state.add('GameWon', GameWon);
        }

        function start(game) {
            game.state.start('Boot');
        }

        return {
            boot: function() {
                var game = createGame();
                setupStates(game);
                start(game);
            }
        };
    }
);