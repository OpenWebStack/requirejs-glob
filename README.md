#requirejs-glob
A RequireJS plugin for loading multiple files that match a glob pattern.

##Why
Most of the time when using [RequireJS](http://requirejs.org/) you want to explicitly declare each file's dependencies. But there are certain situations where it would be more convenient to load a whole handful of files that have a flat dependency tree. For example when using [Angular](http://angularjs.org/) dependencies are "injected", so the order your controllers, services, templates etc. are loaded doesn't matter. For cases like these, the `glob!` plugin can be super useful:

```js
require([
  'glob!controllers/**/*.js',
  'glob!services/**/*.js',
  'glob!filters/**/*.js',
  'glob!directives/**/*.js',
]);
```

Now as you develop your application all new matching files will be included automatically. Each file will also be inlined during the [r.js build](http://requirejs.org/docs/optimization.html).

##How
The Browser environment has no way to find glob-matching files. So this plugin has a tiny server-side companion that runs during development only, listening for requests from the `glob!` plugin and returning lists of matching files. 

One could accomplish something similar with a pre-run compile step like [Grunt](http://gruntjs.com/) or [Component](https://component.jit.su/), but part of the beauty of [RequireJS](http://requirejs.org/) is that it runs natively in the browser without the need for a build step. Most projects already use a webserver during development anyway. I like to think of this approach as "JIT Compiled AMD" plugin. 

This piece is currently available as a [Connect](http://www.senchalabs.org/connect/) and [Express](http://expressjs.com/guide.html) compatible middleware.

##Getting Started
Install the plugin with [Bower](http://twitter.github.com/bower/):
`$ bower install requirejs-glob`
or download [glob.js](lib/glob.js) manually.

Add `glob` to your paths config that points to wherever you installed the glob.js file:

```js
require.config({
  paths: {
    "glob": "../components/requirejs-glob/lib/glob"
  }
})
``` 

Add a `glob` setting to your RequireJS config, that will instruct the server-side piece where to start for the pattern matching:

```js
require.config({
  glob: 'app/js/'
})
```
It should be the **full path** from the root of your project to the [baseUrl](http://requirejs.org/docs/api.html#config-baseUrl) where RequireJS looks to load your scripts from.

Install the [Node](http://nodejs.org/) companion with [npm](https://npmjs.org/):
`$ npm install requirejs-glob`

Use the requirejs-glob express middleware in your **development environment**:

```js
app.configure('development', function(){
  //use requirejs-glob middleware
  app.use(require('requirejs-glob')());
});
```

Once you're all setup you can use the plugin:

```js
require(['glob!controllers/**/*.js'], function(){});
``` 

Enjoy!

##Grunt integration

The middleware can also be used as part of a [Grunt][] build, where the web server
is created with the [grunt-contrib-connect][] task.  To do this, the grunt
task must be configured with custom middleware.

For a registered task named `connect:server`, where compiled files are placed
in the `generated` directory, use the [middleware][] configuration option to
load support for the requirejs glob middleware.

```javascript
connect: {
  server: {
    options: {
      base: "generated",
      middleware: function(connect, options) {
        // Return array of whatever middlewares you want
        return [
          require('requirejs-glob')(),
          // standard middleware for static files and dir browsing
          connect.static(options.base),
          connect.directory(options.base)
        ];
      }
    }
  }
}
```

[Grunt]: http://gruntjs.com/
[grunt-contrib-connect]: https://github.com/gruntjs/grunt-contrib-connect
[middleware]: https://github.com/gruntjs/grunt-contrib-connect#middleware

##License
MIT

##TODO
[] consider standalone for non-node backends
[] tests
[] examples
