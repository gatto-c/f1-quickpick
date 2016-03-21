var logger = require('../../logger');
var co = require('co');
var Race = require('../models/race');
var PlayerPick = require('../models/player-pick');
var ergast = require('../data-access/ergast');
var mongoose = require('mongoose');

/**
 * Acquire and save race calendar data for a given year
 * @param year
 */
module.exports.loadSeasonRaces = function*(year) {
  co(function *(){
    //make sure there aren't already races loaded for the year
    var count = yield Race.count({year: year}).exec();
    if (count > 0) {
      logger.debug('loadYear: there are already', count, 'races loaded for', year, '. No more will be saved.');
      return;
    }

    //acquire calendar for specified year from Ergast
    var calendar = yield ergast.getRaceCalendar(year);

    //save each race to mongo
    for(var index in calendar) {
      if (calendar.hasOwnProperty(index)) {
        var r = calendar[index];
        var race = new Race({
          year: r.season,
          race_number: r.round,
          race_name: r.raceName,
          race_circuit: r.Circuit.circuitName,
          race_circuit_id: r.Circuit.circuitId,
          race_locale: r.Circuit.Location.locality,
          race_country: r.Circuit.Location.country,
          race_date: new Date(r.date + 'T' + r.time)
        });

        race.save(function (err) {
          if (err) {
            return err;
          }
          else {
            logger.log('info', 'Race saved');
          }
        });
      }
    }
  });
};


/**
 * Acquire and save race data (drivers and constructors) for a specific race event
 * @param year - year of the race season
 * @param race_number - the number of the season's race
 * @returns {number}
 */
module.exports.loadRaceData = function*(year, race_number) {
  co(function *(){
    //step 1 - get the race from db
    var race = yield Race.findOne({year: year, race_number: race_number}).exec();
    if (!race) {
      logger.error('Unable to locate race data for season', year, ', race number', race_number);
      return;
    }
    //logger.debug('Race data to be loaded:', race[0].race_name, '(', race[0].race_circuit_id, ')');

    //define a raceDrivers object
    var raceData = {};
    raceData.constructors = [];

    var constructors = [];

    //step 2 - get constructors list for the race from ergast
    var race_constructors = yield ergast.getRaceConstructors(year, race.race_circuit_id);
    //logger.debug('race_constructors:', race_constructors);

    //step 3 - for each constructor get the drivers used at the race from ergast and build out the raceData object
    for (c = 0; c < race_constructors.length; c++) {
      //get the drivers for the constructor at the specific race
      var constructorDrivers = yield ergast.getRaceConstructorDrivers(year, race.race_circuit_id, race_constructors[c].constructorId);

      //build the constructor sub-doc
      var constructor = {
        constructor_id: race_constructors[c].constructorId,
        constructor_name: race_constructors[c].name,
        drivers: []
      };

      //into the constructor sub-doc add each of the constructor's drivers
      for (d = 0; d < constructorDrivers.length; d++) {
        var driver = {
          driver_id: constructorDrivers[d].driverId,
          driver_code: constructorDrivers[d].code,
          driver_name: constructorDrivers[d].givenName + ' ' + constructorDrivers[d].familyName,
          driver_nationality: constructorDrivers[d].nationality
        };

        constructor.drivers.push(driver);
      }

      //push the constructor onto the constructs sub-doc array
      constructors.push(constructor);
    }

    //step 4 - add the constructor/driver sub-doc array to race mongo record and save
    console.log('race:', race);
    race.constructors = constructors;
    console.log('race:', race);
    race.save(function (err) {
      if (err) {
        logger.error(err);
        return err;
      }
      else {
        logger.log('info', 'Race constructor/driver data saved');
      }
    });
  });
};

module.exports.loadTestPick = function*() {
  co(function *(){
    logger.debug('Loading test pick ...');
    var id = mongoose.Types.ObjectId("569aef0513c287b61763f4e1");
    logger.debug('Loading test pick, id:', id);
    var pick = {
      player: id,
      year: 2015,
      race_number: 1,
      race_name: 'Australian Grand Prix',
      race_circuit: 'Albert Park Grand Prix Circuit',
      race_locale: 'Melbourne',
      race_country: 'Australia',
      race_date: "2015-03-15T05:00:00.000Z",
      pick_cutoff_datetime: "2015-03-14T01:00:00.000Z"
    };

    var pickRecord = new PlayerPick(pick);
    pickRecord.save(function(err) {
      if(err) {
        logger.error(err);
      } else {
        logger.info('playerPick saved');
      }
    })
  });
};

module.exports.loadNationalities = function*() {
  co(function *() {
    logger.debug('Loading nationalities...');
  });
}
