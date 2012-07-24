var path = require('path'),
    fs = require('fs'),
    sch = require('./routes.js');

module.exports = function(opts) {
  var dir, engine;

  if (!opts)
    opts = {};

  dir = (opts.dir || 'views');
  engine = opts.engine || '';

  return function(req, res, next) {
    res.render = function(f, o, layout) {
      var rf;
      
      if (layout) {
        rf = f;
        f = layout;
      }

      var ext = path.extname(f).substring(1), rext = path.extname(rf).substring(1), fpath, rfpath;

      if (!ext) { // no extension
        f = f+"."+engine;
        ext = engine;
      }

      if (!rext && layout) {
        rf = rf+"."+engine;
        rext = engine;
      }
      
      fpath = dir+path.sep+f;

      if (layout) rfpath = dir+path.sep+rf;

      fs.exists(fpath, function(exists) {
        if (!exists)
          return res.end(res.writeHead(404));

        fs.readFile(fpath, 'utf8', function(err, data) {
          if (err)
            return res.end(res.writeHead(500));

          if (!~Object.keys(sch).indexOf(ext)) {
            res.writeHead(200);
            return res.end(data);
          }

          try {
            if (!layout) {
              return sch[ext](data, o, function(data, mime) {
                res.writeHead(200, {'Content-Type': (mime || 'text/html')});
                return res.end(data);
              });
            }

            fs.exists(rfpath, function(exists) {
              if (!exists)
                return res.end(res.writeHead(404));

              fs.readFile(rfpath, 'utf8', function(err, rdata) {
                if (err)
                  return res.end(res.writeHead(500));

                if (!~Object.keys(sch).indexOf(ext)) {
                  res.writeHead(200);
                  return res.end(data);
                }

                sch[rext](rdata, o, function(c, mime) {
                  sch[ext](data, {body: c}, function(c, mime) {
                    res.writeHead(200, {'Content-Type': (mime || 'text/html')});
                    return res.end(c);
                  });
                });
              });
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