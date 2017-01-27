var mongoose = require('mongoose');
var ValidationError = mongoose.Error.ValidationError;
var ValidatorError  = mongoose.Error.ValidatorError;
var Schema = mongoose.Schema;
var co = require('co');
var logger = require('../../logger');
var _ = require('lodash');

var PlayerPickSchema = new Schema({
  player: {type: Schema.Types.ObjectId, ref: 'player'},
  year: {type: Number, required: true},
  race_number: {type: Number, required: true},
  picks: [{type: String}],
  created_date: {type: Date, default: Date.now}
}).index({year: 1, race_number: 1, player: 1}, {unique: true});

//length of picks array must be 10
PlayerPickSchema.path('picks').validate(function (picks, respond) {
  if (!picks || picks.length != 10) {
    logger.warn('Player picks length < 10:', picks);
    return respond(false);
  }

  return respond(true);
}, 'must pick 10 drivers');

//a pick must be an array of 10 alpha-only strings
PlayerPickSchema.path('picks').validate(function (picks, respond) {
  //each pick must be alpha-only and length > 1
  var re = /^[A-z]+$/;
  for (var i = 0; i < picks.length; i++) {
    if (!picks[i] || picks[i].length <= 1) {
      logger.warn('Player pick must be alpha-only and length > 1:', picks[i]);
      return respond(false);
    }

    if (!re.test(picks[i])) {
      logger.warn('Player pick not alpha:', picks[i]);
      return respond(false);
    }
  }

  return respond(true);
}, 'must pick 10 valid drivers');

//there can be no duplicate picks
PlayerPickSchema.path('picks').validate(function (picks, respond) {
  var duplicates = _.filter(picks, function (value, index, iteratee) {
    return _.includes(iteratee, value, index + 1);
  });
  if (duplicates && duplicates.length > 0) {
    logger.warn('Player picks must not contain duplicates:', picks);
    return respond(false);
  }

  return respond(true);
}, 'must have no duplicate picks');


/**
 * pre save will insert or update Race info
 */
PlayerPickSchema.pre('save', function(done){
  console.log('save');

  var self = this;
  logger.debug('PlayerPickSchema - pre-save hook');
  done();
});

module.exports = mongoose.model('PlayerPick', PlayerPickSchema);


