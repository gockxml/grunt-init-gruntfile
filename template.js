/*
 * grunt-init-gruntfile
 * https://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create a basic Gruntfile.';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'This template tries to guess file and directory paths, but ' +
  'you will most likely need to edit the generated Gruntfile.js file before ' +
  'running grunt. _If you run grunt after generating the Gruntfile, and ' +
  'it exits with errors, edit the file!_';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = 'Gruntfile.js';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({}, [
      // Prompt for these values.
    /*
    {
      name: 'dom',
      message: 'Is the DOM involved in ANY way?',
      default: 'Y/n',
      warning: 'Yes: QUnit unit tests + JSHint "browser" globals. No: Nodeunit unit tests.'
    },
    {
      name: 'min_concat',
      message: 'Will files be concatenated or minified?',
      default: 'Y/n',
      warning: 'Yes: min + concat tasks. No: nothing to see here.'
  },
    {
      name: 'package_json',
      message: 'Will you have a package.json file?',
      default: 'Y/n',
      warning: 'This changes how filenames are determined and banners are generated.'
    },
  */

   {
      name: 'ng',
      message: 'Will you use AngularJS?',
      default: 'Y/n',
      warning: 'Yes: min + concat tasks. No: nothing to see here.'
    }

  ], function(err, props) {
    props.dom = true ///y/i.test(props.dom);
    props.ng = /y/i.test(props.ng);
    props.min_concat = true /y/i.test(props.min_concat);
    props.package_json = true  ///y/i.test(props.package_json);
    props.test_task = props.dom ? 'qunit' : 'nodeunit';
    props.file_name = props.package_json ? '<%= pkg.name %>' : 'FILE_NAME';

    // Find the first `preferred` item existing in `arr`.
    function prefer(arr, preferred) {
      for (var i = 0; i < preferred.length; i++) {
        if (arr.indexOf(preferred[i]) !== -1) {
          return preferred[i];
        }
      }
      return preferred[0];
    }

    // Guess at some directories, if they exist.
    var dirs = grunt.file.expand({filter: 'isDirectory'}, '*').map(function(d) { return d.slice(0, -1); });
    props.lib_dir = prefer(dirs, ['lib', 'src']);
    props.test_dir = prefer(dirs, ['test', 'tests', 'unit', 'spec']);

    // Maybe this should be extended to support more libraries. Patches welcome!
    props.jquery = grunt.file.expand({filter: 'isFile'}, '**/jquery*.js').length > 0;

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);


    // If is package_json true, generate package.json
    if (props.package_json) {
      var devDependencies = {
        'grunt': '~0.4.2',
        'grunt-contrib-jshint': '~0.7.2',
        'grunt-contrib-watch': '~0.5.3'
        'sugar': '~1.4.1',
        'grunt-convert' : "~0.1.8",
        'grunt-contrib-cssmin' : "~0.6.1" 
      };

      if (props.dom) {
        devDependencies['grunt-contrib-qunit'] = '~0.3.0';
      } else {
        devDependencies['grunt-contrib-nodeunit'] = '~0.2.2';
      }

      if (props.min_concat) {
        devDependencies['grunt-contrib-concat'] = '~0.3.0';
        devDependencies['grunt-contrib-uglify'] = '~0.2.7';
        devDependencies["grunt-htmlrefs"] = "~0.4.1";
        devDependencies["grunt-contrib-compress"] = "~0.5.2";
      }
      if (props.ng) {
        devDependencies['grunt-ngmin'] = '~0.0.3';
      }

      // Generate package.json file, used by npm and grunt.
      init.writePackageJSON('package.json', {
        node_version: '>= 0.10.0',
        devDependencies: devDependencies
      });
    }

    // All done!
    done();
  });

};
