var Race = require('../models/race');
var PlayerPick = require('../models/player-pick');
var RaceDriver = require('../models/race-driver');
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

/**
 * determine if the player has a pick for the specified year/race#
 * @param playerId
 * @param year
 * @param raceNumber
 * @returns {boolean}
 */
module.exports.playerHasPick = function*(playerId, year, raceNumber){
  //convert playerId into mongoose objectId
  var playerObjectId = mongoose.Types.ObjectId(playerId);

  var count = yield PlayerPick.count({
    player: playerObjectId,
    year: year,
    race_number: raceNumber
  }).exec();

  return (count == 1);
};

/**
 * Returns pick for user in the specified year/race#
 * @param playerId
 * @param year
 * @param raceNumber
 * @returns {*}
 */
module.exports.getPlayerPick = function*(playerId, year, raceNumber){
  //convert playerId into mongoose objectId
  var playerObjectId = mongoose.Types.ObjectId(playerId);

  return yield PlayerPick.find({
    player: playerObjectId,
    year: year,
    race_number: raceNumber
  }).exec();
};

/**
 * Return array of drivers/teams entered for the specified year/race#
 * @param year
 * @param raceNumber
 * @returns {*}
 */
module.exports.getRaceDetails = function*(year, raceNumber){
  return yield RaceDriver.find({
    year: year,
    race_number: raceNumber
  }).exec();
};
