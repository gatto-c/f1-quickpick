var LocalStrategy = require('passport-local').Strategy;

const passport = require('koa-passport')
    ,mongoose = require('mongoose')
    ,User = require('./server/models/player')
    ,logger = require('./logger')
    ,co = require('co');

passport.serializeUser(function(user, done) {
  done(null, user.id)
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
});

/**
 * local authorization using f1-quickpick database
 * @param username
 * @param password
 * @param done
 */
function authLocalUser(username, password, done) {
  logger.debug('authLocalUser.....');

  co(function*() {
    try {
      return yield User.matchPlayer(username, password);
    } catch (ex) {
      return null;
    }
  }).then(done.bind(null, null), done);
}

passport.use(new LocalStrategy(authLocalUser));

//var FacebookStrategy = require('passport-facebook').Strategy;
//passport.use(new FacebookStrategy({
//    clientID: 'your-client-id',
//    clientSecret: 'your-secret',
//    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/facebook/callback'
//  },
//  function(token, tokenSecret, profile, done) {
//    // retrieve user ...
//    done(null, user)
//  }
//));
//
//var TwitterStrategy = require('passport-twitter').Strategy;
//passport.use(new TwitterStrategy({
//    consumerKey: 'your-consumer-key',
//    consumerSecret: 'your-secret',
//    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/twitter/callback'
//  },
//  function(token, tokenSecret, profile, done) {
//    // retrieve user ...
//    done(null, user)
//  }
//));
//
//var GoogleStrategy = require('passport-google-auth').Strategy;
//passport.use(new GoogleStrategy({
//    clientId: 'your-client-id',
//    clientSecret: 'your-secret',
//    callbackURL: 'http://localhost:' + (process.env.PORT || 3000) + '/auth/google/callback'
//  },
//  function(token, tokenSecret, profile, done) {
//    // retrieve user ...
//    done(null, user)
//  }
//));
