var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var co = require('co');
var logger = require('../../logger');

var RaceSchema = new Schema({
  year: {type: Number, required: true, },
  race_number: {type: Number, required: true},
  race_name: {type: String, required: true},
  race_circuit_id: {type: String, required: true},
  race_circuit: {type: String, required: true},
  race_locale: {type: String, required: true},
  race_country: {type: String, required: true},
  race_date: {type: Date, required: true},
  pick_cutoff_datetime: {type: Date, required: false},
  constructors: [{
    constructor_id: {type: String, required: true},
    constructor_name: {type: String, required: true},
    drivers: [{
      driver_id: {type: String, required: true},
      driver_code: {type: String, required: true},
      driver_name: {type: String, required: true},
      driver_nationality: {type: String, required: false}
    }]
  }]
}).index({year: 1, race_number: 1}, {unique: true});

/**
 * pre save will insert or update Race info
 */
RaceSchema.pre('save', function(done){
  var self = this;
  logger.debug('RaceSchema - pre-save hook');
  done();
});

module.exports = mongoose.model('Race', RaceSchema);

