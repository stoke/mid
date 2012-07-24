var mid = require('../lib/mid.js'),
    APIeasy = require('api-easy'),
    path = require('path'),
    assert = require('assert'),
    connect = require('connect');

var random = Math.random().toString();

var app = connect()
  .use(mid({engine: 'ejs', dir: __dirname + path.sep + "views"}))
  .use(function(req, res, next) {
    switch(req.url) {
      case '/':
        res.render('test', {test: random});
        break;

      case '/other':
        res.render('nonexistent', {test: random});
        break;

      case '/bad':
        res.render('bad.styl');
        break;

      case '/layout':
        res.render('test.ejs', {test: random}, 'layout.ejs');
        break;
    }
  })
  .listen(3000);

var suite = APIeasy.describe('mid.js');

suite.use('localhost', 3000)
  .get('/')
    .expect(200)
    .expect('html should be equal to random', function(err, res, body) {
      assert.equal(body, random);
    })
  .next()

  .get('/layout')
    .expect(200)
    .expect('html should be equal to random + layout', function(err, res, body) {
      assert.equal(body, '<b>'+random+'</b>');
    })
  .next()

  .get('/other')
    .expect(404)
  .next()

  .get('/bad')
    .expect(500)
  .export(module);
  