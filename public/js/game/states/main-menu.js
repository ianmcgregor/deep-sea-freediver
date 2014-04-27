/* main-menu.js */
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

        function MainMenu(game) {
            Phaser.State.call(this, game);
        }

        MainMenu.prototype = Object.create(Phaser.State.prototype);
        MainMenu.prototype.constructor = MainMenu;

        MainMenu.prototype.create = function() {
            this.createChildren();
            this.initializeAudio();
            this.loadSavedGame();
        };

        MainMenu.prototype.createChildren = function() {
            this.layerGroup = this.game.add.group();
            this.parallaxLayers = new ParallaxLayers(this.game);
            this.parallaxLayers.init(this.layerGroup);

            this.title = this.game.add.bitmapText(0, 84, Settings.game.font, 'DEEP SEA\nFREEDIVER', 36);
            this.title.align = 'center';
            this.title.x = (this.game.width - this.title.textWidth) * 0.5;
            
            this.instructions = this.game.add.bitmapText(0, 270, Settings.game.font, 'USE THE ARROW KEYS TO DIVE,\nDISCOVER HIDDEN TREASURES\nAND AVOID HAZARDS!', 24);
            this.instructions.align = 'center';
            this.instructions.x = (this.game.width - this.instructions.textWidth) * 0.5;

            this.playButton = new TextButton(this.game, 'PLAY', 'textures', 'button_up', 'button_down', this.play, this);
            this.playButton.x = (this.game.width - this.playButton.width) * 0.5;
            this.playButton.y = 400;
        };

        MainMenu.prototype.initializeAudio = function() {
            Audio.init(this.game);
            Audio.music('music');
        };

        MainMenu.prototype.loadSavedGame = function() {
            if(Settings.game.urlParams.reset && Settings.game.urlParams.reset === 'true') {
                Memory.reset();
            }
            Memory.load();
        };

        MainMenu.prototype.update = function() {
            if (this.playButton && this.playButton.visible && this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.play();
            }
            this.parallaxLayers.updateScrolling(20,20);
        };

        MainMenu.prototype.play = function() {
            if(!isNaN(parseFloat(UrlParams.level))) {
                Memory.setCurrentLevel(parseFloat(UrlParams.level));
            }
            this.game.state.start('LevelLoader');
        };

        MainMenu.prototype.shutdown = function() {
            if(this.playButton) {
                this.playButton.destroy();
            }
            this.playButton = null;
            if(this.parallaxLayers) {
                this.parallaxLayers.destroy();
            }
            this.parallaxLayers = null;
        };

        return MainMenu;
    }
);