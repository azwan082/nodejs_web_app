module.exports = function(grunt) {
  grunt.initConfig({

    // check all js files for error
    jshint: {
      all: [
        '*.js',
        'lib/**/*.js',
        'routes/**/*.js',
        'models/**/*.js',
        'public/src/js/*.js',
      ]
    },

    // combine & minify js files
    uglify: {
      build: {
        files: [
          {
            expand: true,
            src: '*.js',
            dest: 'public/dist/js/',
            cwd: 'public/src/js/'
          }
        ]
      }
    },

    // combine & minify css files
    cssmin: {
      build: {
        files: [
          {
            expand: true,
            src: '*.css',
            dest: 'public/dist/css/',
            cwd: 'public/src/css/'
          }
        ]
      }
    },

    // start mongodb
    shell: {
      mongodb: {
        command: 'mongod',
        options: {
          async: true,
          stdout: false,
          stderr: true,
          failOnError: true
        }
      }
    },

    // watch source files for changes
    watch: {
      css: {
        files: ['public/src/css/*.css'],
        tasks: ['cssmin']
      },
      js: {
        files: ['public/src/js/*.js'],
        tasks: ['jshint', 'uglify']
      },
      app: {
        files: [
          '*.js',
          'lib/**/*.js',
          'routes/**/*.js',
          'models/**/*.js',
        ],
        tasks: ['jshint']
      },
      jade: {
        files: ['views/**/*.jade']
      }
    },

    // nodemon
    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    // run watch & nodemon at the same time
    concurrent: {
      tasks: ['shell', 'nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },

  });

  // load tasks plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell-spawn');

  // register tasks
  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'concurrent']);
  grunt.registerTask('deploy', ['uglify', 'cssmin']);

};