var LocalStrategy = require('passport-local').Strategy;

const passport = require('koa-passport')
    ,mongoose = require('mongoose')
    ,User = require('./server/models/player')
    ,logger = require('./logger')
    ,co = require('co');

//var user = {};

passport.serializeUser(function(user, done) {
  done(null, user.id)
});

passport.deserializeUser(function(id, done) {
  User.findById(id, done);
});

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

//passport.use(new LocalStrategy(function(username, password, done) {
//  // check in mongo if a user with username exists or not
//  Player.findOne({ 'username' :  username },
//    function(err, user) {
//      // In case of any error, return using the done method
//      if (err)  return done(err);
//
//      logger.log('debug', 'checking user:', username, ', password:', password);
//
//      // Username does not exist, log error & redirect back
//      if (!user){
//        return done(null, false,
//          logger.log('warn', 'User Not Found with username', username));
//      }
//
//      // User exists but wrong password, log the error
//      if (!user.validPassword(password)){
//        return done(null, false,
//          logger.log('warn', 'Invalid Password'));
//      }
//
//      // User and password both match, return user from
//      // done method which will be treated like success
//      logger.debug('user authorized: ', username);
//      return done(null, user);
//    }
//  );
//}));

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
