"use strict";

// Enable requiring modules relative to server directory
require('app-module-path').addPath(__dirname + '/server');

const getIdentity = function(){
  let os = require('os');
  return {
    serverIdentity: os.hostname(),
    processIdentity: process.env['processIdentity']
  }
};

module.exports.startServer = function(config) {
  // lib
  const
    koa = require('koa'),
    koaRender = require('koa-render'),
    favicon = require('koa-favicon'),
    bodyParser = require('koa-bodyparser'),
    logger = require('./logger'),
    session = require('koa-generic-session'),
    mongoStore = require('koa-generic-session-mongo'),
    mongo = require('koa-mongo'),
    mongoose = require('mongoose'),
    passport = require('koa-passport'),
    jwt = require('koa-jwt'),
    admin = require('admin/admin');

  // integration
  const
    serveStaticContent = require('middleware/my-koa-static-folder'),
    routes = require('routes/routes');

  // init
  const
    app = koa(),
    id = getIdentity(),
    FIFTEEN_MINUTES = 15 * 60 * 1000;

  console.log('Starting:', id);
  //console.log('Starting with config:', config);

  app.keys = ['6AD7BC9C-F6B5-4384-A892-43D3BE57D89F'];
  app.use(session({
    key: 'Pick10',
    store: new mongoStore({url: config.mongoUri}),
    rolling: true,
    cookie: {maxage: FIFTEEN_MINUTES}
  }));

  app.use(favicon(__dirname + '/client/favicon.ico'));

  app.use(function*(next){
    yield next;
    if(this.status == 404) {
      console.log('no route handler', this.path, routes);
    }
  });

  // Custom 401 handling if you don't want to expose koa-jwt errors to users
  app.use(function *(next){
    try {
      yield next;
    } catch (err) {
      if (401 == err.status) {
        this.status = 401;
        this.body = 'Protected resource, use Authorization header to get access\n';
      } else {
        throw err;
      }
    }
  });

  // establish the server-side templates
  app.use(koaRender('./server/server-side-views', {
    map: { html: 'swig' },
    cache: false
  }));

  //// connect to mongoose erm
  mongoose.connect(config.mongoUri);

  // body parser
  app.use(bodyParser());

  // authentication
  require('./auth');
  app.use(passport.initialize());
  app.use(passport.session());

  //admin.loadRaceData(2015, 19).next();
  //admin.loadSeasonRaces(2011).next();
  //admin.loadTestPick().next();

  // Anonymous routes (static files)
  app.use(serveStaticContent(__dirname, './client'));

  // anonymous API calls
  app.use(routes.anonymousRouteMiddleware(passport));

  // Middleware below this line is only reached if JWT token is valid
  app.use(jwt({ secret: config.jwtSecret }));

  // Require authentication for now
  app.use(function*(next) {
    var ctx = this;
    if (ctx.isAuthenticated()) {
      yield next;
    } else {
      logger.warn('User not authenticated');
      yield ctx.redirect('/')
    }
  });

  // secured routes requiring authentication
  app.use(routes.secureRouteMiddleware(passport));

  // It's go time
  app.listen(config.port);
  console.log('F1-QuickPick listening on: ' + config.port)
};
