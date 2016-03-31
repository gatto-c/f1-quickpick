var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var co = require('co');
var logger = require('../../logger');

var PlayerPickSchema = new Schema({
  player: {type: Schema.Types.ObjectId, ref: 'player'},
  year: {type: Number, required: true},
  race_number: {type: Number, required: true},
  picks: [String],
  created_date: {type: Date, default: Date.now}
}).index({year: 1, race_number: 1, player: 1}, {unique: true});

/**
 * pre save will insert or update Race info
 */
PlayerPickSchema.pre('save', function(done){
  var self = this;
  logger.debug('PlayerPickSchema - pre-save hook');
  done();
});

module.exports = mongoose.model('PlayerPick', PlayerPickSchema);


