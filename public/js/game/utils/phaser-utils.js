/* utils.js */

define(
    [
        'Phaser'
    ],
    function(Phaser) {

        'use strict';

        return {
            getMaxScreenDimension: function() {
                return Math.max( window.screen.width, window.screen.height, window.outerWidth, window.outerHeight );
            },
            getAssetSize: function() {
                var maxScreenDimension = this.getMaxScreenDimension();

                if(maxScreenDimension >= 1280) {
                    return 'hd';
                }
                else if(maxScreenDimension >= 568) {
                    return 'sd';
                }
                return 'ld';
            },
            createRoundedBMD: function(game, image, width, height) {
                var img;
                var key;
                if(typeof(image) === 'string'){
                    img = game.cache.getImage(image);
                    key = image;
                }else{
                    img = image.canvas;
                    key = image.key;
                }

                var maskFrame = game.cache.getFrameData('loader').getFrameByName('rounded_rectangle');
                var maskSrc = game.cache.getImage('loader');
                var maskSrcRect = new Phaser.Rectangle(maskFrame.x, maskFrame.y, maskFrame.width, maskFrame.height);

                var scale = Math.max(width/img.width, height/img.height);
                var offsetX = (img.width*scale - width);
                var offsetY = (img.height*scale - height);

                var bmd = new Phaser.BitmapData(game, key, width, height);
                bmd.context.scale(scale, scale);
                bmd.draw(img, -offsetX, -offsetY);
                bmd.context.scale(1/scale,1/scale);
                bmd.ctx.globalCompositeOperation = 'destination-in';
                bmd.context.drawImage(maskSrc, maskSrcRect.x, maskSrcRect.y, maskSrcRect.width, maskSrcRect.height, 0, 0, width, height);

                return bmd;
            },
            createOverlay: function(game, alpha, color){
                alpha = alpha === undefined ? 1 : alpha;
                color = color === undefined ? 0x081520 : color;

                var overlay = game.add.graphics(0, 0);
                overlay.beginFill(color);
                overlay.moveTo(0,0);
                overlay.lineTo(game.width, 0);
                overlay.lineTo(game.width, game.height);
                overlay.lineTo(0, game.height);
                overlay.lineTo(0, 0);
                overlay.endFill();
                overlay.alpha = alpha;

                return overlay;
            },
            takeScreenGrab: function(game) {
                var grab = new Phaser.BitmapData(game, 'screenGrab', game.width, game.height);
                grab.ctx.fillStyle = '#FF0000';
                grab.ctx.fillRect(0,0,game.width, game.height);
                grab.ctx.drawImage(game.canvas, 0, 0);
                return grab;
            }
        };
    }
);