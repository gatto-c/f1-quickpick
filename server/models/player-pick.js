var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var co = require('co');
var logger = require('../../logger');

var PlayerPickSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'player'},
  year: {type: Number, required: true},
  race_number: {type: Number, required: true},
  race_name: {type: String, required: true},
  race_circuit: {type: String, required: true},
  race_locale: {type: String, required: true},
  race_country: {type: String, required: true},
  race_date: {type: Date, required: true},
  pick_cutoff_datetime: {type: Date, required: false}
});

/**
 * pre save will insert or update Race info
 */
PlayerPickSchema.pre('save', function(done){
  var self = this;
  logger.debug('PlayerPickSchema - pre-save hook');
  done();
});

module.exports = mongoose.model('PlayerPick', PlayerPickSchema);


