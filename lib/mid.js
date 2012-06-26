var path = require('path'),
    fs = require('fs'),
    ejs = require('ejs'),
    jade = require('jade'),
    hogan = require('hogan.js'),
    eco = require('eco'),
    stylus = require('stylus'),
    less = require('less'),
    sass = require('sass'),
    ghm = require('github-flavored-markdown');

var sch = {
  'ejs': function(t, o, fn) {
    fn(ejs.render(t, o));
  },

  'jade': function(t, o, fn) {
    var j = jade.compile(t);
    fn(j(o));
  },

  'mustache': function(t, o, fn) {
    var c = hogan.compile(t);
    fn(c.render(o));
  },

  'eco': function(t, o, fn) {
    fn(eco.render(t, o));
  },

  'stylus': function(t, o, fn) {
    stylus.render(t, function(err, css) {
      if (err)
        throw err;

      fn(css, 'text/css');
    });
  },

  'less': function(t, o, fn) {
    less.render(t, function(err, css) {
      if (err)
        throw err;

      fn(css, 'text/css');
    });
  },

  'sass': function(t, o, fn) {
    fn(sass.render(t), 'text/css');
  },

  'md': function(t, o, fn) {
    fn(ghm.parse(t));
  }
}

module.exports = function(opts) {
  var dir, engine;

  if (!opts)
    opts = {};

  dir = (opts.dir || 'views');
  engine = opts.engine || '';

  return function(req, res, next) {
    res.render = function(f, o) {
      var ext = path.extname(f).substring(1), fpath;

      if (!ext) { // no extension
        f = f+"."+engine;
        ext = engine;
      }
      
      fpath = dir+path.sep+f;

      fs.exists(fpath, function(exists) {
        if (!exists)
          return res.end(res.writeHead(404));

        fs.readFile(fpath, 'utf8', function(err, data) {
          if (err)
            return res.end(res.writeHead(500));

          if (!(ext in sch)) {
            res.writeHead(200);
            return res.end(data);
          }

          try {
            sch[ext](data, o, function(data, mime) {
              res.writeHead(200, {'Content-Type': (mime || 'text/html')});
              return res.end(data);
            });
          } catch (_) {
            return res.end(res.writeHead(500));
          }
        });
      });
    };

    return next();
  }
}