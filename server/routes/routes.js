"use strict";

const
  Router = require('koa-router'),
  logger = require('../../logger'),
  Player = require('../models/player'),
  jwt = require('koa-jwt'),
  config = require('../../config.js')[process.env['F1QuickPick_ENV']] || require('../../config.js')['development'],
  dataAccess = require('../data-access/data-access');

/**
 * Anonymous routes requiring no authentication
 * @param passport
 */
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


/**
 * Secure routes requiring user authentication
 * @param passport
 */
module.exports.secureRouteMiddleware = function(passport) {
  const routes = new Router();

  routes.get('/user/:id', function*(next) {
    var ctx = this;
    ctx.type = "application/json";
    ctx.body = "{user: 1}";
  });

  /**
   * get the race calendar data for the specified year
   */
  routes.get('/raceCalendar/:year', function*(next) {
    var ctx = this;
    ctx.type = "application/json";
    ctx.body = yield dataAccess.getRaceCalendar(ctx.params.year);
  });

  /**
   * determine if player has pick specified by the season and race number
   */
  routes.get('/player/hasPick/:year/:raceNumber', function*(next) {
    var ctx = this;
    ctx.type = "application/json";
    ctx.body = yield dataAccess.playerHasPick(ctx.passport.user._id, ctx.params.year, ctx.params.raceNumber);
  });

  /**
   * get the player pick specified by the season and race number
   */
  routes.get('/player/pick/:year/:raceNumber', function*(next) {
    var ctx = this;
    ctx.type = "application/json";
    ctx.body = yield dataAccess.getPlayerPick(ctx.passport.user._id, ctx.params.year, ctx.params.raceNumber);
  });

  routes.post('/player/pick', function*(next) {
    var ctx = this;
    logger.debug('routes > post > /player/pick:', ctx.request.body.year, ctx.request.body.raceNumber, ctx.request.body.picks);
    ctx.body = yield dataAccess.submitPlayerPicks(ctx.passport.user._id, ctx.request.body.year, ctx.request.body.raceNumber, ctx.request.body.picks);
  });

  /**
   * get the race details for the specified season/race#
   */
  routes.get('/raceDetails/:year/:raceNumber', function*(next) {
    var ctx = this;
    ctx.type = "application/json";
    ctx.body = yield dataAccess.getRaceDetails(ctx.params.year, ctx.params.raceNumber);
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
