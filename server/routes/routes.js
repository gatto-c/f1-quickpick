"use strict";

const
  Router = require('koa-router'),
  logger = require('../../logger'),
  Player = require('../models/player'),
  jwt = require('koa-jwt'),
  config = require('../../config.js')[process.env['F1QuickPick_ENV']] || require('../../config.js')['development'];

module.exports.anonymousRouteMiddleware = function(passport) {
  const
  routes = new Router(),
  pages = require('route-handlers/anonymous/pages');

  routes.get('/', pages.applicationPage);
  routes.get('/application', pages.applicationPage);

  /**
   * handle login post
   */
  routes.post('/login', function*(next) {
    var ctx = this;
    yield passport.authenticate('local', function*(err, player, info) {
      if (err) throw err;
      if (player === false) {
        ctx.status = 401;
        ctx.body = { success: false }
      } else {
        yield ctx.login(player);
        ctx.status = 200;
        //ctx.body = { success: true }
        ctx.body = {success: true, token: player.generateJWT()};
      }
    }).call(this, next)
  });

  /**
   * handle registration post
   */
  routes.post('/register', function*(next) {
    //http://tastenjesus.de/koajs-first-application-using-kamn-stack-part-12/
    //https://github.com/dozoisch/koa-react-full-example/blob/master/
    var ctx = this;

    //create a new player mongoose model
    var player = new Player({username: ctx.request.body.username, password: ctx.request.body.password, email: ctx.request.body.username});

    //attempt to save new player
    try {
      yield player.save();
      ctx.status = 200;
      ctx.body = {success: true, token: player.generateJWT()};
      //ctx.body = { success: true };
    } catch (err) {
      //if this is an error condition return relevant error to caller
      ctx.status = (err.message == 'duplicate' ? 409 : 401); //409 represents a duplicate player, 401 a general error
      ctx.body = { success: false };
      ctx.body = {}
    }
  });

  /**
   * handle logout get
   */
  routes.get('/logout', function*(next) {
    this.logout();
    this.redirect('/');
  });

  return routes.middleware();
};
