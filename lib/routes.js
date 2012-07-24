var ejs = require('ejs'),
    jade = require('jade'),
    hogan = require('hogan.js'),
    eco = require('eco'),
    stylus = require('stylus'),
    less = require('less'),
    sass = require('sass'),
    ghm = require('github-flavored-markdown');

module.exports = {
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

  'styl': function(t, o, fn) {
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