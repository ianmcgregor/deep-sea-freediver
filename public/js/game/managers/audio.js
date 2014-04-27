/* audio.js */
define([], function() {
        'use strict';

        function Audio() {
            this.game = null;
            this.currentMusic = null;
            this.sounds = {};
            this.delayedSfxTimeouts = [];
            this.keys = [];
        }

        Audio.prototype = {
            init: function(game) {
                this.game = game;

                for (var i = 0; i < this.keys.length; i++) {
                    this.add(this.keys[i]);
                }
            },
            add: function(key) {
                var sound = this.game.add.audio(key, 1, false, true);
                this.sounds[key] = sound;
                return sound;
            },
            sfx: function(key, delay) {
                //console.log('Audio.sfx(', key, ')');
                var currentSfx = this.sounds[key] || this.add(key);
                if(delay !== undefined && delay > 0) {
                    var delayedSfx = setTimeout(function(){
                        currentSfx.play();
                    }, delay);
                    this.delayedSfxTimeouts.push(delayedSfx);
                }
                else {
                    currentSfx.play();
                }
            },
            loop: function(key, start) {
                //console.log('Audio.loop(', key, start, ')');
                var currentSfx = this.sounds[key] || this.add(key);
                if(start){
                    currentSfx.play('',0,1,true);
                }else{
                    currentSfx.stop();
                }
            },
            music: function(key) {
                if(this.currentMusic && this.currentMusic.key === key && this.currentMusic.isPlaying) {
                    return;
                }
                if(this.currentMusic) {
                    this.currentMusic.stop();
                    this.currentMusic.pendingPlayback = false;
                }
                this.currentMusic = this.sounds[key] || this.add(key);
                this.currentMusic.play('', 0, 1, true);
            },
            setMusicVolume: function(volume){
                if( this.currentMusic && this.currentMusic.isPlaying ) {
                    if( !this.currentMusic._muted ){
                        if (this.currentMusic.usingWebAudio){
                            this.currentMusic.gainNode.gain.value = volume;
                        }else if(this.currentMusic.usingAudioTag && this.currentMusic._sound){
                            this.currentMusic._sound.volume = volume;
                        }
                        this.currentMusic._volume = volume;
                    }else{
                        this.currentMusic._muteVolume = volume;
                    }
                }
            },
            stopAll: function() {
                this.game.sound.stopAll();
                for (var i = 0; i < this.delayedSfxTimeouts.length; i++) {
                    clearTimeout(this.delayedSfxTimeouts[i]);
                }
                this.delayedSfxTimeouts.length = 0;
            }
        };

        return new Audio();
    }
);