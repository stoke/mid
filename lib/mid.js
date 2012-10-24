var path = require('path'),
    fs = require('fs'),
    async = require('async'),
    renders = require('./renders');

function readFiles(names, cbl) {
  names = Array.isArray(names) ? names : [names];
  async.mapSeries(names, fs.readFile, function(err, results) {
    if (err) return cbl(err);

    results = results.map(function(result) {
      return result.toString();
    });

    cbl(err, results);
  });
};

function renderFile(opts, name, locals, cbl) {
  var ext = path.extname(name).slice(1) || opts.engine,
      names = (opts.layout) ? [name, opts.layout] : [name];

  names = names.map(function(x) {
    x = path.join(opts.dir, x);

    if (!path.extname(x))
      x += '.' + opts.engine;
    
    return x;
  });

  if (!renders[ext])
    return cbl(new Error('Render not found'));

  readFiles(names, function(err, contents) {
    if (err) return cbl(err);
    
    renders[ext](contents[0], locals, function(err, template) {
      if (err) return cbl(err);

      if (!contents[1])
        return cbl.apply(cbl, arguments);

      renders[ext](contents[1], {body: template}, cbl);
    });
  });
};

module.exports = function(opts) {
  opts = opts || {};

  opts.engine = opts.engine || 'jade';
  opts.dir = opts.dir || __dirname;

  return function(req, res, next) {
    res.render = function(name, locals, layout) {
      if (layout) opts.layout = layout;

      renderFile(opts, name, locals, function(err, content, mime) {
        if (err) {
          if (err.errno === 34)
            res.end(res.writeHead(404));
          else
            res.end(res.writeHead(500));
        }

        res.writeHead(200, {'Content-Type': mime || 'text/html'});
        res.end(content);
      });
    };

    next();
  };
};