var logger = require('../../logger');
var co = require('co');
var Race = require('../models/race');
var RaceDriver = require('../models/race-driver');
var ergast = require('../data-access/ergast');

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
    //step 0 - precheck to make sure that there are is current race-driver data for the year/race_number
    count = yield RaceDriver.count({year: year, race_number: race_number}).exec();
    if (count > 0) {
      logger.debug('loadRaceData: there are already', count, 'race-drivers loaded for race#', race_number, 'of', year, '. No more will be saved.');
      return;
    }

    //step 1 - get the race schedule for the year from db
    var race = yield Race.find({year: year, race_number: race_number}).exec();
    if (!race || race.length != 1) {
      logger.error('Unable to locate race data for season', year, ', race number', race_number);
      return;
    }
    //logger.debug('Race data to be loaded:', race[0].race_name, '(', race[0].race_circuit_id, ')');

    //define a raceDrivers object
    var raceData = {};
    raceData.constructors = [];

    //step 2 - get constructors list for the race from ergast
    var race_constructors = yield ergast.getRaceConstructors(year, race[0].race_circuit_id);
    //logger.debug('race_constructors:', race_constructors);

    //step 3 - for each constructor get the drivers used at the race from ergast and build out the raceData object
    for (i = 0; i < race_constructors.length; i++) {
      var constructorDrivers = yield ergast.getRaceConstructorDrivers(year, race[0].race_circuit_id, race_constructors[i].constructorId);
      raceData.constructors.push({constructor_id: race_constructors[i].constructorId, constructor_name: race_constructors[i].name, drivers: constructorDrivers});
    }

    //step 4 - save the data as race-driver records in mongo
    for (c = 0; c < raceData.constructors.length; c++) {
      for (d = 0; d < raceData.constructors[c].drivers.length; d++){
        //console.log('Constructor:', raceData.constructors[c].constructor_name, ', Driver:', raceData.constructors[c].drivers[d]);
        var raceDriver = new RaceDriver({
          year: year,
          race_number: race_number,
          race_name: race[0].race_name,

          constructor_id: raceData.constructors[c].constructor_id,
          constructor_name: raceData.constructors[c].constructor_name,

          driver_id: raceData.constructors[c].drivers[d].driverId,
          driver_code: raceData.constructors[c].drivers[d].code,
          driver_name: raceData.constructors[c].drivers[d].givenName + ' ' + raceData.constructors[c].drivers[d].familyName
        });

        raceDriver.save(function (err) {
          if (err) {
            return err;
          }
          else {
            logger.log('info', 'Race Driver saved');
          }
        });
      }
    }
  });
};

