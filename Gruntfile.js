module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        //pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['app/nation/app/views/*.js'],
                dest: 'app/nation/app/combined_views.js'
            }
        },

        uglify: {
            build: {
                src: 'app/nation/app/Router.js',
                dest: 'app/nation/app/Router_min.js'
            }
        }
        /*cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'app/MyApp/app',
                    src: ['app.css', '!*.min.css'],
                    dest: 'app/MyApp/app',
                    ext: '.min.css'
                }]
            }
        }*/

        /*less: {
            options: {
                paths: ["css"]
            },
            files: {
                "styles.css": "less/styles.less"
            }
        }*/

        /*watch: {
            scripts: {
                files: 'app/MyApp/app/views/*.js',
                tasks: ['newer:concat', 'newer:uglify:build'],
                options: {
                    atBegin: true,
                    event:['all']
                }
            }

            /*styles: {
                files: 'css/less/**.less',
                task: 'less'
            }
        }*/

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-newer');

    // Default task(s).
    grunt.registerTask('default', ['newer:concat', 'newer:uglify']);

};