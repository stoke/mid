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
    fn(null, ejs.render(t, o));
  },

  'jade': function(t, o, fn) {
    var j = jade.compile(t);
    fn(null, j(o));
  },

  'mustache': function(t, o, fn) {
    var c = hogan.compile(t);
    fn(null, c.render(o));
  },

  'eco': function(t, o, fn) {
    fn(null, eco.render(t, o));
  },

  'styl': function(t, o, fn) {
    stylus.render(t, function(err, css) {
      fn(err, css, 'text/css');
    });
  },

  'less': function(t, o, fn) {
    less.render(t, function(err, css) {
      fn(err, css, 'text/css');
    });
  },

  'sass': function(t, o, fn) {
    fn(null, sass.render(t), 'text/css');
  },

  'md': function(t, o, fn) {
    fn(null, ghm.parse(t));
  }
}