var rp = require('request-promise');
var logger = require('../../logger');
var _ = require('lodash');
var co = require('co');
var Race = require('../models/race');
var RaceDriver = require('../models/race-driver');
var config = require('../../config').getConfig();
var request = require('koa-request');

/**
 * Acquire and save race calendar data for a given year
 * @param year
 */
var loadYear = function(year) {
  var count;
  co(function *(){
    //make sure there aren't already races loaded for the year
    count = yield Race.count({year: year}).exec();
    if (count > 0) {
      logger.debug('loadYear: there are already', count, 'races loaded for', year, '. No more will be saved.');
      return;
    }

    //load particulars for calling ergast season-calendar api
    var options = {
      uri: 'http://ergast.com/api/f1/' + year + '.json',
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };

    //get the season data from ergast
    rp(options)
      .then(function (races) {
        var myRaces = races;
        var raceCount = myRaces.MRData.total;
        var raceTable = myRaces.MRData.RaceTable;
        var raceArray = myRaces.MRData.RaceTable.Races;

        logger.debug('Loading', raceCount, 'races');
        logger.debug('Races:', raceArray[0].Circuit);

        //save each race
        for(var index in raceArray) {
          if (raceArray.hasOwnProperty(index)) {
            r = raceArray[index];
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

            const raceName = race.race_name;

            race.save(function (err) {
              if (err) {
                return err;
              }
              else {
                logger.log('info', 'Race saved: ', raceName);
              }
            });
          }
        }
      })
      .catch(function (err) {
        logger.error(err);
      });
  });
};


/**
 * Acquire and save race data (drivers and constructors) for a specific race event
 * @param year - year of the race season
 * @param race_number - the number of the season's race
 * @returns {number}
 */
var loadRaceData = function*(year, race_number) {
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
    var race_constructors = yield ergastGetRaceConstructors(year, race[0].race_circuit_id);
    //logger.debug('race_constructors:', race_constructors);

    //step 3 - for each constructor get the drivers used at the race from ergast and build out the raceData object
    for (i = 0; i < race_constructors.length; i++) {
      var constructorDrivers = yield ergastGetRaceConstructorDrivers(year, race[0].race_circuit_id, race_constructors[i].constructorId);
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

  return;
};

/**
 * Get the constructors for a specific race
 * @param year - year of race
 * @param circuit_id - the circuit_id we want constructors race data for
 * @returns {*}
 */
var ergastGetRaceConstructors = function*(year, circuit_id) {
  return co(function *(){
    //load particulars for calling ergast race/constructors api
    //ex: http://ergast.com/api/f1/2015/circuits/monza/constructors
    var options = {
      url: config.ergastAPIAddress + year + '/circuits/'+ circuit_id +'/constructors' + '.json',
      headers: {
        'User-Agent': 'request'
      },
      json: true // Automatically parses the JSON string in the response
    };

    //logger.debug('Getting ergast race/constructors data: ', options.url);

    //get the season data from ergast
    var response = yield request(options);
    return response.body.MRData.ConstructorTable.Constructors;
  });
};

/**
 * Get the drivers for each constructor for the specified race
 * @param year - the year of the race
 * @param circuit_id - the id of the race circuit
 * @param constructor_id - the id of the constructor we want
 * @returns {*}
 */
var ergastGetRaceConstructorDrivers = function*(year, circuit_id, constructor_id) {
  return co(function *(){
    //logger.debug('Getting ergast race/constructor/drivers data for: year:', year, ', circuit_id:', circuit_id, 'constructor_id:', constructor_id);

    //load particulars for calling ergast race/constructors api
    //ex: http://ergast.com/api/f1/2015/constructors/mclaren/circuits/monza/drivers
    var options = {
      url: config.ergastAPIAddress + year + '/constructors/' + constructor_id + '/circuits/'+ circuit_id +'/drivers' + '.json',
      headers: {
        'User-Agent': 'request'
      },
      json: true // Automatically parses the JSON string in the response
    };

    //logger.debug('Getting ergast race/constructor/drivers data: ', options.url);

    //get the season data from ergast
    var response = yield request(options);
    //console.log('race drivers: ', response.body.MRData.DriverTable.Drivers);
    return response.body.MRData.DriverTable.Drivers;
  });
};

module.exports.loadYear = loadYear;
module.exports.loadRaceData = loadRaceData;
