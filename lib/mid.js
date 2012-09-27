var path  = require('path'),
    fs    = require('fs'),
    async = require('async'),
    sch   = require('./routes.js');

function absolute(d, f) {
  return d + path.sep + f;
}

module.exports = function(opts) {
  if (!opts)
    opts = {};

  var dir    = opts.dir || 'views',
      engine = opts.engine || 'jade';

  return function(req, res, next) {
    res.render = function(view, o, layout) {
      var ext = path.extname(view).substring(1), views;
      
      layout = layout || opts.layout;

      if (!ext) {
        view += '.' + engine;
        ext = engine;
      }

      views = [absolute(dir, view)];

      if (layout)
        views.push(absolute(dir, layout));
      
      async.filter(views, fs.exists, function(results) {
        if (!results || results.length !== views.length)
          return res.end(res.writeHead(404));

        async.map(views, fs.readFile, function(e, files) {
          if (e)
            return res.end(res.writeHead(500));

          files = files.map(function(i) {
            return i.toString();
          });

          sch[ext](files[0], o, function(e, t) {
            if (e)
              return res.end(res.writeHead(500));

            if (!layout)
              return res.end(t);

            sch[ext](files[1], {body: t}, function(e, r) {
              if (e)
                return res.end(res.writeHead(500));

              res.end(r);
            });
          });
        });
      });
    };

    return next();
  };
};