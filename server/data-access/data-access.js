var Race = require('../models/race');
var PlayerPick = require('../models/player-pick');

/**
 * Returns the race calendar data for the specified year
 * @param year
 * @returns {*}
 */
module.exports.getRaceCalendar = function*(year){
  return yield Race.find({
    year: year
  }).sort('race_number').exec();
};

module.exports.getPlayerPick = function*(year, raceNumber){
  console.log('getting Player Pick....');
  return yield PlayerPick.find({
    year: year,
    race_number: raceNumber
  }).exec();
};
