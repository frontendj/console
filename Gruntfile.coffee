module.exports = (grunt) ->
  'use strict'

  require('load-grunt-tasks')(grunt)

  debug = !!grunt.option('debug')
  prefix = if debug then '' else '/console/'

  grunt.initConfig

    jquery:
      version: '1.8.3'
      dest: 'build/js/jquery.custom.js'
      minify: true

    coffee:
      compile:
        expand: true
        flatten: true
        cwd: 'src/js'
        src: ['*.coffee']
        dest: 'build/js/'
        ext: '.js'
        #files:
        #  'src/js/modules.js': ['src/js/timers.coffee', 'src/js/app.coffee', 'src/js/console.coffee', 'src/js/tabs.coffee']

    slim:
      dist:
        files:
          'index.html': 'src/slim/index.slim'

    compass:
      dist:
        options:
          sassDir: 'src/sass'
          cssDir: 'build/css'
          environment: 'development'
          outputStyle: 'expanded'

    replace:
      version:
        files:
          'index.html': 'index.html'
        options:
          patterns: [
            {
              match: /(\.js|\.css)[^"]*/gi
              replacement: '$1?<%= grunt.template.today("yyyymmddHHMM") %>'
            }
            {
              match: /"build/gi
              replacement: '"'+prefix+'build'
            }
          ]

    watch:
      compass:
        options:
          atBegin: true
        files: ['src/sass/**']
        tasks: ['compass']
      slim:
        options:
          atBegin: true
        files: ['src/slim/*']
        tasks: ['slim']
      coffee:
        options:
          atBegin: true
        files: ['src/js/**']
        tasks: ['coffee']

  grunt.registerTask 'build', ['coffee', 'jquery', 'slim', 'compass', 'replace']
