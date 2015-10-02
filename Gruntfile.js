/**
 * Created by muhammad.waqas on 10/1/2015.
 */
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /*concat: {
            dist: {
               // src: ['attachments/lms/app/App.js','attachments/lms/app/Router.js'],
                //dest: 'attachments/lms/app/build.js'
            }
        },*/
        /*uglify: {
            my_target: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: 'app/MyApp/app/views/*.js',
                    dest:'app/MyApp/app/views/dest/js'
                }]
            }
        }*/
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'app/MyApp/app/views/*.js',
                dest:'app/MyApp/app/views/dest/min.js'
            }
        }
    })

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task(s).
    grunt.registerTask('default', ['uglify'])

};