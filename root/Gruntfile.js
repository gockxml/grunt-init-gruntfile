/*global module:false*/
require('sugar');
var fs = require('fs');
module.exports = function(grunt) {
  var version = 'calendar/' + Date.create().format("{yy}{MM}{dd}{HH}{mm}")
  fs.writeFileSync("version", version)
  // Project configuration.
  grunt.initConfig({{% if (min_concat) { %}
    // Metadata.{% if (package_json) { %}
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',{% } else { %}
    meta: {
      version: '0.1.0'
    },
    banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* http://PROJECT_WEBSITE/\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      'YOUR_NAME; Licensed MIT */\n',{% } } %}
    // Task configuration.{% if (min_concat) { %}
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['{%= lib_dir %}/{%= file_name %}.js'],
        dest: 'dist/{%= file_name %}.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/{%= file_name %}.min.js'
      }
    },{% } %}
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,{% if (dom) { %}
        browser: true,{% } %}
        globals: {{% if (jquery) { %}
          jQuery: true
        {% } %}}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['{%= lib_dir %}/**/*.js', '{%= test_dir %}/**/*.js']
      }
    },{% if (dom) { %}
    {%= test_task %}: {
      files: ['{%= test_dir %}/**/*.html']
    },{% } else { %}
    {%= test_task %}: {
      files: ['{%= test_dir %}/**/*_test.js']
    },{% } %}
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', '{%= test_task %}']
      }
    },
    htmlrefs: {
      index: {
        src: 'index.html',
        dest: 'build/index.html',
      },
    },
    replace: {
      CDN : {
        src : 'build/index.*',
        overwrite: true,
        replacements: [{ from :  /\{= *CDN *\}/g, to : 'http://assets-th.qiniudn.com/' + version  }]
      },
      DEFAULT : {
        src : 'build/index.*',
        overwrite: true,
        replacements: [{ from :  /\{= *CDN *\}/g, to : 'http://localhost:9999/build' }]
      }
    },
    copy : {
      css : {
        src : "sass/style.scss.css",
        dest: "build/css/style.css"
      }
    }
  });

  // These plugins provide necessary tasks.{% if (min_concat) { %}
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');{% } %}
  grunt.loadNpmTasks('grunt-contrib-{%= test_task %}');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-htmlrefs');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-text-replace');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-convert');
  grunt.loadNpmTasks('grunt-ngmin');
  // Default task.
  grunt.registerTask('default', ['jshint', '{%= test_task %}'{%= min_concat ? ", 'concat', 'uglify'" : "" %}]);

};
