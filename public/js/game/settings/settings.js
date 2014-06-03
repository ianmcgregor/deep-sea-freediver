/* settings.js */
define(
    [
        'Phaser',
        'game/utils/url-params'
    ],
    function(Phaser, UrlParams) {
        'use strict';

        var device = new Phaser.Device();

        var debug = UrlParams.debug === 'true';

        var bust = debug ? '?bust=' + Date.now() : '';

        var assetSize = 'hd';//UrlParams.size || PhaserUtils.getAssetSize();

        document.documentElement.classList.add(assetSize);

        var width = 512,
            height = 512,
            gameScales = {
                ld: 0.25,
                sd: 0.5,
                hd: 1
            };

        var scale = gameScales[assetSize];
        var baseUrls = {
            img: 'img/',
            data: 'data/',
            font: 'font/',
            audio: 'audio/'
        };

        return {
            game: {
                urlParams: UrlParams,
                debug: debug,
                width: width * scale,
                height: height * scale,
                scale: scale,
                renderer: (debug||device.ie||device.android) ? Phaser.CANVAS : Phaser.AUTO, // If we are debugging use canvas, if we are in IE use canvas, otherwise let Phaser decide
                id: 'game-wrapper',
                assetSize: assetSize,
                device: device,
                font: 'Silkscreen',
                backgroundColor: 0x086172
            },
            world: {
                gravity: { x: 0, y: 200 },
                maxDeltaTime: 0.1
            },
            hero: {
                lives: 6,
                initialPosition: { x: 124, y: 128*scale },
                mass: 1,
                velocity: { x: 200*scale, y: 0 },
                maxVelocity: { x: 200*scale, y: -200*scale },
                acceleration: { x: 100*scale, y: 0 }
            },
            levels: [
                {
                    name: 'level1',
                    parallaxLayers: [
                        {
                            assetKey: 'background',
                            dimensions: { x: 0, y: 0, w: 512*scale, h: 512*scale },
                            scrollingSpeed: { x : 0.01, y : 0.2 },
                            fixedToCamera: true
                        },
                        {
                            assetKey: 'background',
                            dimensions: { x: 0, y: 0, w: 512*scale, h: 512*scale },
                            scrollingSpeed: { x : 0, y : 0.3 },
                            fixedToCamera: true
                        },
                        {
                            assetKey: 'waves_back',
                            dimensions: { x: 0, y: 62, w: 512*scale, h: 128*scale },
                            scrollingSpeed: { x : -0.01, y : 0 },
                            fixedToCamera: false
                        },
                        {
                            assetKey: 'waves',
                            dimensions: { x: 0, y: 128, w: 512*scale, h: 64*scale },
                            scrollingSpeed: { x : 0.03, y : 0 },
                            fixedToCamera: false
                        },
                        {
                            assetKey: 'clouds',
                            dimensions: { x: 0, y: 0, w: 512*scale, h: 80*scale },
                            scrollingSpeed: { x : 0.01, y : 0 },
                            fixedToCamera: false
                        }
                    ]
                }
            ],
            camera: {
                deadzones: {
                    down: {
                        x: 20*scale, y: 100*scale, w: 130*scale, h: 100*scale
                    },
                    up: {
                        x: 20*scale, y: 300*scale, w: 130*scale, h: 100*scale
                    }
                }
            },
            controls: {
                tapRate: 50,
                swipeThreshold: 10
            },
            assets: {
               boot: {
                    images: [
                        { key: 'background', url: baseUrls.img+assetSize+'/background.png'}
                    ],
                    atlases: [
                        { key: 'loader', textureURL: baseUrls.img+assetSize+'/loader.png', atlasURL: baseUrls.img+assetSize+'/loader.json', format: Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY }
                    ],
                    fonts: [
                        { key: 'Silkscreen', textureURL: baseUrls.font+'/silkscreen.png', xmlURL: baseUrls.font+'/silkscreen.xml' }
                    ]
                },
                preloader: {
                    images: [
                        { key: 'tiles', url: baseUrls.img+assetSize+'/tiles.png' },
                        { key: 'waves', url: baseUrls.img+assetSize+'/waves.png'},
                        { key: 'waves_back', url: baseUrls.img+assetSize+'/waves_back.png'},
                        { key: 'clouds', url: baseUrls.img+assetSize+'/clouds.png'}
                    ],
                    data: [

                    ],
                    atlases: [
                        { key: 'textures', textureURL: baseUrls.img+assetSize+'/textures.png', atlasURL: baseUrls.img+assetSize+'/textures.json', format: Phaser.Loader.TEXTURE_ATLAS_JSON_ARRAY }
                    ],
                    sounds: [
                        { key: 'collect', urls: [ baseUrls.audio+'collect.ogg', baseUrls.audio+'collect.mp3'], autoDecode: true },
                        { key: 'select', urls: [ baseUrls.audio+'bullet.ogg', baseUrls.audio+'bullet.mp3'], autoDecode: true },
                        { key: 'hit', urls: [ baseUrls.audio+'hit.ogg', baseUrls.audio+'hit.mp3'], autoDecode: true },
                        { key: 'music', urls: [ baseUrls.audio+'music.ogg', baseUrls.audio+'music.mp3'], autoDecode: true }
                    ]
                },
                levels: [
                    {
                        images: [
                        ],
                        atlases: [
                        ],
                        tilemaps: [
                            { key: 'map', mapDataURL: baseUrls.data+'level1.json'+bust, format: Phaser.Tilemap.TILED_JSON }
                        ]
                    }
                ]
            }
        };
    }
);
