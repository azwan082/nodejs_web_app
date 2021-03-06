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

    // jade
    jade: {
      template: {
        options: {
          client: true,
          namespace: 'views'
        },
        expand: true,
        cwd: 'views/',
        src: '__*.jade',
        dest: 'public/dist/js/views/',
        ext: '.js'
      }
    },

    // start mongodb
    shell: {
      mongodb: {
        command: 'mongod.sh'
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
        files: ['views/**/*.jade'],
        tasks: ['jade']
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
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell');

  // register tasks
  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'jade', 'concurrent']);
  grunt.registerTask('deploy', ['uglify', 'cssmin', 'jade']);

};