var Race = require('../models/race');
var PlayerPick = require('../models/player-pick');
var mongoose = require('mongoose');
var logger = require('../../logger');

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
  return yield Race.findOne({
    year: year,
    race_number: raceNumber
  }).exec();
};

/**
 * Save the player picks for race to player-picks collection
 * @param userId - the id of user submitting picks
 * @param year - the year of the race
 * @param raceNumber - the race number (in year)
 * @param picks - array of driverIds
 * @returns {*}
 */
module.exports.submitPlayerPicks = function*(playerId, year, raceNumber, picks) {
  console.log('submitPlayerPicks called:', playerId, year, raceNumber, picks);

  //convert playerId into mongoose objectId
  var playerObjectId = mongoose.Types.ObjectId(playerId);

  //delete any existing playerPick for the same year/race
  yield PlayerPick.find({
    player: playerObjectId,
    year: year,
    race_number: raceNumber
  }).remove().exec(function(err, data){
    if (err) {
      logger.error('Problem deleting existing playerPick:', err.message);
    } else {
      logger.debug('Existing playerPick deleted', data.result);
    }
  });

  //console.log('player pick deleted:', d);

  //create new playerPick object
  var pick = new PlayerPick({
    player: playerObjectId,
    year: year,
    race_number: raceNumber,
    picks: picks
  });

  //save the pick to db
  return yield pick.save(pick, function(err, data) {
    if (err) {
      logger.error('Problem saving playerPick:', err.message);
    } else {
      logger.debug('playerPick saved:', picks);
    }
  });
};
