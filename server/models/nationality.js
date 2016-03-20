var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var co = require('co');
var logger = require('../../logger');

var NationalitySchema = new Schema({
  nationality: {type: Number, required: true},
  county: {type: Number, required: true},
  country_flag: {type: String, required: true}
});

/**
 * pre save will insert or update Nationality info
 */
NationalitySchema.pre('save', function(done){
  var self = this;
  logger.debug('NationalitySchema - pre-save hook');
  done();
});

module.exports = mongoose.model('Nationality', NationalitySchema);

