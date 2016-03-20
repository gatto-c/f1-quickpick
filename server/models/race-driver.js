var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var co = require('co');
var logger = require('../../logger');

var RaceDriverSchema = new Schema({
  year: {type: Number, required: true},
  race_number: {type: Number, required: true},
  race_name: {type: String, required: true},
  driver_id: {type: String, required: true},
  driver_name: {type: String, required: true},
  driver_code: {type: String, required: true},
  driver_nationality: {type: String, required: false},
  constructor_id: {type: String, required: true},
  constructor_name: {type: String, required: true}
});

/**
 * pre save will insert or update Race info
 */
RaceDriverSchema.pre('save', function(done){
  var self = this;
  logger.debug('RaceDriverSchema - pre-save hook');
  done();
});

module.exports = mongoose.model('RaceDriver', RaceDriverSchema);


