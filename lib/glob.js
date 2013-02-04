/**
 * glob.js
 * A RequireJS plugin for loading multiple files that match a glob pattern.
 * See https://github.com/OpenWebStack/requirejs-glob for details
 * 
 * Copyright 2013 Dave Geddes 
 * @geddesign davidcgeddes.gmail.com
 * MIT License
 */

define(function(){
  var buildFiles = {};

  return {
    /**
     * load matched files, using the server to help find matches
     */
    load:function(name, req, load, config) {
      var files;
      var globFrom = config.glob;
      if (!globFrom) throw new Error('glob.js plugin requires the "glob" config setting');

      // during the build we load the actual file contents in Node
      if (config.isBuild){
        var glob = require.nodeRequire('requirejs-glob');
        files = glob.contents(name, globFrom);
        buildFiles[name] = [];
        files.forEach(function(file){
          buildFiles[name].push(file);
        });
        load(files);
      }
      else{
        // in the browser we just request matching files from the Node web service
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'requirejs-glob?glob=' + name + '&from=' + globFrom);
        xhr.send();
        xhr.onreadystatechange = function(){
          if (xhr.readyState === 4){
            files = JSON.parse(xhr.responseText);
            //load all the files with RequireJS
            req(files, function(){
              load(files);
            });
          }
        };
      }
    },

    /**
     * write contents of matched files during the build
     */
    write:function(pluginName, name, write) {
      if (name in buildFiles) {
        //write the glob module
        write('define("glob!'+name+'");');
        //write the contents of the matched files
        var files = buildFiles[name];
        files.forEach(function(file){
          write(file);
        });
      }
    }
  };
});