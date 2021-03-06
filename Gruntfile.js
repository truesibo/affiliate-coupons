/*global module:false*/
module.exports = function (grunt) {

    // Load multiple grunt tasks using globbing patterns
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        less: {
            admin: {
                options: {
                    cleancss: false
                },
                src: [
                    'assets/less/admin.less'
                ],
                dest: 'public/assets/css/admin.css'
            },
            admin_min: {
                options: {
                    cleancss: true,
                    compress: true
                },
                src: [
                    'assets/less/admin.less'
                ],
                dest: 'public/assets/css/admin.min.css'
            },
            styles: {
                options: {
                    cleancss: false
                },
                src: [
                    'assets/less/style.less'
                ],
                dest: 'public/assets/css/styles.css'
            },
            styles_min: {
                options: {
                    cleancss: true,
                    compress: true
                },
                src: [
                    'assets/less/style.less'
                ],
                dest: 'public/assets/css/styles.min.css'
            }
        },
        uglify: {
            admin: {
                options: {
                    beautify: true
                },
                src: [
                    'assets/js/admin.js'
                ],
                dest: 'public/assets/js/admin.js'
            },
            admin_min: {
                src: [
                    'public/assets/js/admin.js'
                ],
                dest: 'public/assets/js/admin.min.js'
            },
            scripts: {
                options: {
                    beautify: true
                },
                src: [
                    'node_modules/clipboard/dist/clipboard.js',
                    'assets/js/scripts.js'
                ],
                dest: 'public/assets/js/scripts.js'
            },
            scripts_min: {
                src: [
                    'public/assets/js/scripts.js'
                ],
                dest: 'public/assets/js/scripts.min.js'
            }
        },
        autoprefixer: {
            options: {
                browsers: [
                    'Android 2.3',
                    'Android >= 4',
                    'Chrome >= 20',
                    'Firefox >= 24',
                    'Explorer >= 8',
                    'iOS >= 6',
                    'Opera >= 12',
                    'Safari >= 6'
                ]
            },
            min: {
                options: {
                    cascade: false
                },
                expand: true,
                flatten: true,
                src: 'public/assets/css/*.css',
                dest: 'public/assets/css/'
            }
        },
        checktextdomain: {
            options: {
                text_domain: '<%= pkg.pot.textdomain %>',
                keywords: [
                    '__:1,2d',
                    '_e:1,2d',
                    '_x:1,2c,3d',
                    'esc_html__:1,2d',
                    'esc_html_e:1,2d',
                    'esc_html_x:1,2c,3d',
                    'esc_attr__:1,2d',
                    'esc_attr_e:1,2d',
                    'esc_attr_x:1,2c,3d',
                    '_ex:1,2c,3d',
                    '_n:1,2,4d',
                    '_nx:1,2,4c,5d',
                    '_n_noop:1,2,3d',
                    '_nx_noop:1,2,3c,4d',
                    ' __ngettext:1,2,3d',
                    '__ngettext_noop:1,2,3d',
                    '_c:1,2d',
                    '_nc:1,2,4c,5d'
                ]
            },
            files: {
                expand: true,
                src: [
                    '**/*.php', // Include all files
                    '!node_modules/**', // Exclude node_modules/
                    '!build/**', // Exclude build folder/
                    '!includes/libs/**' // Exclude libs folder/
                ]
            }
        },
        makepot: {
            target: {
                options: {
                    domainPath: '<%= pkg.directories.languages %>', // Where to save the POT file.
                    exclude: ['build/.*'],
                    mainFile: '<%= pkg.pot.src %>', // Main project file.
                    potFilename: '<%= pkg.pot.textdomain %>' + '.pot', // Name of the POT file.
                    potHeaders: {
                        poedit: true, // Includes common Poedit headers.
                        'x-poedit-keywordslist': true, // Include a list of all possible gettext functions.
                        'report-msgid-bugs-to': '<%= pkg.pot.header.bugs %>',
                        'last-translator': '<%= pkg.pot.header.last_translator %>',
                        'language-team': '<%= pkg.pot.header.team %>',
                        'language': 'en_US'
                    },
                    type: '<%= pkg.pot.type %>', // Type of project (wp-plugin or wp-theme).
                    updateTimestamp: true, // Whether the POT-Creation-Date should be updated without other changes.
                    updatePoFiles: true, // Whether to update PO files in the same directory as the POT file.
                    processPot: function (pot, options) {
                        var translation, // Exclude meta data from pot.
                            excluded_meta = [
                                'Plugin Name of the plugin/theme',
                                'Plugin URI of the plugin/theme',
                                'Author of the plugin/theme',
                                'Author URI of the plugin/theme'
                            ];
                        for (translation in pot.translations['']) {
                            if ('undefined' !== typeof pot.translations[''][translation].comments.extracted) {
                                if (excluded_meta.indexOf(pot.translations[''][translation].comments.extracted) >= 0) {
                                    console.log('Excluded meta: ' + pot.translations[''][translation].comments.extracted);
                                    delete pot.translations[''][translation];
                                }
                            }
                        }
                        return pot;
                    }
                }
            }
        },
        potomo: {
            dist: {
                options: {
                    poDel: false // Set to true if you want to erase the .po
                },
                files: [{
                    expand: true,
                    cwd: '<%= pkg.directories.languages %>',
                    src: ['*.po'],
                    dest: '<%=  pkg.directories.languages %>',
                    ext: '.mo',
                    nonull: true
                }]
            }
        },
        watch: {
            less: {
                files: 'public/assets/**/*.less',
                tasks: 'less'
            },
            uglify: {
                files: 'public/assets/**/*.js',
                tasks: 'uglify'
            }
        },
        // Clean up build directory
        clean: {
            main: ['build/<%= pkg.name %>']
        },
        // Copy the plugin into the build directory
        copy: {
            main: {
                src:  [
                    '**',
                    '!node_modules/**',
                    '!build/**',
                    '!assets/**',
                    '!.git/**',
                    '!Gruntfile.js',
                    '!deploy.sh',
                    '!package.json',
                    '!.gitignore',
                    '!.gitmodules',
                    '!.tx/**',
                    '!tests/**',
                    '!**/Gruntfile.js',
                    '!**/package.json',
                    '!**/README.md',
                    '!**/*~'
                ],
                dest: 'build/<%= pkg.name %>/'
            }
        },

        //Compress build directory into <name>.zip and <name>-<version>.zip
        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: './build/<%= pkg.name %>.zip'
                },
                expand: true,
                cwd: 'build/<%= pkg.name %>/',
                src: ['**/*'],
                dest: '<%= pkg.name %>/'
            }
        }
    });

    // Default task.
    grunt.registerTask('dist-css', ['less', 'autoprefixer']);
    grunt.registerTask('default', ['less', 'uglify', 'autoprefixer']);

    // Build task(s).
    grunt.registerTask( 'build:translations', [ 'checktextdomain', 'makepot', 'newer:potomo' ] );
    grunt.registerTask( 'build', [ 'clean', 'copy', 'compress' ] );
};