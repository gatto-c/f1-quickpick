var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var Schema = mongoose.Schema;
var co = require('co');
var logger = require('../../logger');
var jwt = require('jsonwebtoken');
var config = require('../../config.js')[process.env['F1QuickPick_ENV']] || require('../../config.js')['development'];

var PlayerSchema = new Schema({
  username: {type: String, lowercase: true, unique: true, required: true, trim: true},
  password: {type: String, required: true},
  email: {type: String, required: true, trim: true},
  created: Date
});

//generate password hash function
var genHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//// generating a password hash
//PlayerSchema.methods.generateHash = genHash;

// checking if password is valid
PlayerSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

PlayerSchema.methods.generateJWT = function() {
  // set expiration to 60 days
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000)
  }, config.jwtSecret);
};

/**
 * pre save will insert or update player info
 */
PlayerSchema.pre('save', function(done){
  var self = this;

  co(function*() {
    try {
      yield mongoose.models["Player"].findOne({username: self.username}, function(err, myplayer) {
        if(myplayer) {
          done(new Error('duplicate'));
        } else {
          //if this is a new player then hash the incoming password and set created date
          now = new Date();
          if ( !self.created ) {
            self.password = genHash(self.password);
            self.created = now;
          }
          done();
        }
      });
    } catch(err) {
      logger.error(err);
      done(err);
    }
  });

});

module.exports = mongoose.model('Player', PlayerSchema);
