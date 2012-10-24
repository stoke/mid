var ejs = require('ejs'),
    jade = require('jade'),
    hogan = require('hogan.js'),
    eco = require('eco'),
    stylus = require('stylus'),
    less = require('less'),
    sass = require('sass'),
    marked = require('marked');

exports.ejs = function(t, o, fn) {
  fn(null, ejs.render(t, o));
};

exports.jade = function(t, o, fn) {
  var j = jade.compile(t);
  fn(null, j(o));
};

exports.mustache = function(t, o, fn) {
  var c = hogan.compile(t);
  fn(null, c.render(o));
};

exports.eco = function(t, o, fn) {
  fn(null, eco.render(t, o));
};

exports.styl = function(t, o, fn) {
  stylus.render(t, function(err, css) {
    fn(err, css, 'text/css');
  });
};

exports.less = function(t, o, fn) {
  less.render(t, function(err, css) {
    fn(err, css, 'text/css');
  });
};

exports.sass = function(t, o, fn) {
  fn(null, sass.render(t), 'text/css');
};

exports.md = function(t, o, fn) {
  fn(null, marked(t));
};