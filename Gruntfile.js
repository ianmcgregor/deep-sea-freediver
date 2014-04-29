module.exports = function(grunt) {

    'use strict';

    var publicRoot = 'public';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: [
                'Gruntfile.js',
                publicRoot + '/**/*.js'
            ],
            options: {
                ignores: [
                    publicRoot + '/js/vendor/**/*.js',
                    publicRoot + '/js/lib/**/*.js',
                    publicRoot + '/js/main.min.js'
                ],

                'node': true,
                'browser': true,
                'es5': false,
                'esnext': true,
                'bitwise': false,
                'camelcase': false,
                'curly': true,
                'eqeqeq': true,
                'immed': true,
                'latedef': true,
                'newcap': true,
                'noarg': true,
                'quotmark': 'single',
                'regexp': true,
                'undef': true,
                'unused': true,
                'strict': true,
                'trailing': true,

                'predef': [
                    'define',
                    'Modernizr',
                    'requirejs',
                    'ga',
                    'PIXI'
                ]
            }
        },
        clean: {
            build: {
                src: [
                    publicRoot + '/css/main.min.css',
                    publicRoot + '/js/main.min.js'
                ]
            }
        },
        requirejs: {
            js: {
                options: {
                    almond: true,
                    logLevel: 2,
                    mainConfigFile: publicRoot + '/js/main.js',
                    baseUrl: publicRoot + '/js',
                    name: 'vendor/almond/almond',
                    include: ['main'],
                    insertRequire: ['main'],
                    out: publicRoot + '/js/main.min.js',
                    optimize: 'uglify',
                    preserveLicenseComments: false,
                    wrap: false
                }
            },
            css: {
                options: {
                    logLevel: 2,
                    optimizeCss: 'standard',
                    cssIn: publicRoot + '/css/main.css',
                    out: publicRoot + '/css/main.min.css'
                }
            }
        },
        strip : {
            main : {
                src: publicRoot + '/js/main.min.js',
                dest: publicRoot + '/js/main.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-strip');

    grunt.registerTask('build', ['requirejs:js', 'strip']);
    grunt.registerTask('default', ['jshint', 'build']);
};