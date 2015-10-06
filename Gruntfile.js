module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        //pkg: grunt.file.readJSON('package.json'),

        //Code for community level
        /*concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['app/MyApp/app/views/*.js'],
                dest: 'app/MyApp/app/combined_views.js'
            }
        },

        uglify: {
            build: {
                src: 'app/MyApp/app/combined_views.js',
                dest: 'app/MyApp/app/combined_views_min.js'
            }
        }*/
        //End community code

        //Code for nation level
        /*concat: {
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
                src: 'app/nation/app/combined_views.js',
                dest: 'app/nation/app/combined_views_min.js'
            }
        }*/
        //End nation code


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