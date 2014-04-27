requirejs.config({
    baseUrl: 'js',
    paths: {
        Phaser: 'vendor/phaser-official/build/custom/phaser-arcade-physics.min',
        domReady: 'vendor/requirejs-domready/domReady',
    },
    shim: {
    }
});

require(
    [
        'domReady',
        'game/game'
    ],
    function(domReady, Game) {
        'use strict';

        domReady(function() {
            Game.boot();
        });
    }
);