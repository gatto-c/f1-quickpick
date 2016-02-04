var Race = require('../models/race');

/**
 * Returns the race calendar data for the specified year
 * @param year
 * @returns {*}
 */
module.exports.getRaceCalendar = function*(year){
  var data = yield Race.find({
    year: year
  }).sort('race_number').exec();

  return data;
};
