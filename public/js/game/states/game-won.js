define(
    [
        'Phaser',
        'game/settings/settings',
        'game/managers/memory',
        'game/ui/components/text-button',
        'game/utils/url-params',
        'game/managers/audio',
        'game/objects/parallax-layers'
    ],
    function(Phaser, Settings, Memory, TextButton, UrlParams, Audio, ParallaxLayers) {
        'use strict';

        function GameWon(game) {
            Phaser.State.call(this, game);
        }

        GameWon.prototype = Object.create(Phaser.State.prototype);
        GameWon.prototype.constructor = GameWon;

        GameWon.prototype.create = function() {
            this.layerGroup = this.game.add.group();
            this.parallaxLayers = new ParallaxLayers(this.game);
            this.parallaxLayers.init(this.layerGroup);

            this.title = this.game.add.bitmapText(0, 84, Settings.game.font, 'DEEP SEA\nFREEDIVER', 36);
            this.title.align = 'center';
            this.title.x = (this.game.width - this.title.textWidth) * 0.5;

            var message = 'YOU WIN\n\nSCORE: ' + Memory.getScore() + '\nBEST: ' + Memory.getBestScore();
            this.instructions = this.game.add.bitmapText(0, 250, Settings.game.font, message, 24);
            this.instructions.align = 'center';
            this.instructions.x = (this.game.width - this.instructions.textWidth) * 0.5;

            this.playButton = new TextButton(this.game, 'PLAY AGAIN', 'textures', 'button_up', 'button_down', this.play, this);
            this.playButton.x = (this.game.width - this.playButton.width) * 0.5;
            this.playButton.y = 400;

            Memory.resetGame(Settings.hero.lives);
            Memory.save();
        };

        GameWon.prototype.update = function() {
            if (this.playButton && this.playButton.visible && this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.play();
            }
            this.parallaxLayers.updateScrolling(20,20);
        };

        GameWon.prototype.play = function() {
            if(!isNaN(parseFloat(UrlParams.level))) {
                Memory.setCurrentLevel(parseFloat(UrlParams.level));
            }
            this.game.state.start('LevelLoader');
        };

        GameWon.prototype.shutdown = function() {
            if(this.playButton) {
                this.playButton.destroy();
            }
            this.playButton = null;
            if(this.parallaxLayers) {
                this.parallaxLayers.destroy();
            }
            this.parallaxLayers = null;
        };

        return GameWon;
    }
);