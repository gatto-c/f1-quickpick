var Race = require('../models/race');
var PlayerPick = require('../models/player-pick');
var mongoose = require('mongoose')

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

module.exports.getPlayerPick = function*(playerId, year, raceNumber){
  var playerObjectId = mongoose.Types.ObjectId(playerId);

  console.log('Getting pick for player id:', playerId);

  return yield PlayerPick.find({
    player: playerObjectId,
    year: year,
    race_number: raceNumber
  }).exec();
};
