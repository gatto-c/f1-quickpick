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
    bodyParser = require('koa-bodyparser'),
    logger = require('./logger'),
    session = require('koa-generic-session'),
    mongoStore = require('koa-generic-session-mongo'),
    mongo = require('koa-mongo'),
    mongoose = require('mongoose'),
    passport = require('koa-passport'),
    jwt = require('koa-jwt'),
    loadYear = require('admin/load-year');

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

  app.keys = ['6AD7BC9C-F6B5-4384-A892-43D3BE57D89F'];
  app.use(session({
    key: 'Pick10',
    store: new mongoStore({url: config.mongoUri}),
    rolling: true,
    cookie: {maxage: FIFTEEN_MINUTES}
  }));

  app.use(function*(next){
    yield next;
    if(this.status == 404) {
      console.log('no route handler', this.path, routes);
    }
  });

  //use jwt token if available - allow all requests to be processed but require auth downstream
  //app.use(jwt({ secret: config.jwtSecret, passthrough: true }));

  // establish the server-side templates
  app.use(koaRender('./server/server-side-views', {
    map: { html: 'swig' },
    cache: false
  }));

  //// connect to mongoose erm
  mongoose.connect(config.mongoUri);

  loadYear.loadYear(2016);

  //
  ////create new model for race
  //var Race = require('./server/models/race');
  //var race = new Race({year: 2016, race_number: 1, race_name: "Australian Grand Prix", race_circuit: "Albert Park Grand Prix Circuit", race_locale: "Melbourne", race_country: "Australia", race_date: Date("2016-03-20T05:00:00Z")});
  //race.save(function (err) {
  //  if (err) {
  //    return err;
  //  }
  //  else {
  //    logger.log('info', 'Race saved: ', race.race_name);
  //  }
  //});



  // body parser
  app.use(bodyParser());

  // authentication
  require('./auth');
  app.use(passport.initialize());
  app.use(passport.session());

  // Anonymous routes (static files)
  app.use(serveStaticContent(__dirname, './client'));

  // anonymous API calls
  app.use(routes.anonymousRouteMiddleware(passport));

  // It's go time
  app.listen(config.port);
  console.log('F1-QuickPick listening on: ' + config.port)
};
