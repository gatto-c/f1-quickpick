var rp = require('request-promise');
var logger = require('../../logger');
var _ = require('lodash');
var co = require('co');
var Race = require('../models/race');

/**
 * Aquire and save race calendar data for a given year
 * @param year
 */
var loadYear = function(year) {
  var options = {
    uri: 'http://ergast.com/api/f1/' + year + '.json',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  rp(options)
    .then(function (races) {
      var myRaces = races;
      var raceCount = myRaces.MRData.total;
      var raceTable = myRaces.MRData.RaceTable;
      var raceArray = myRaces.MRData.RaceTable.Races;

      logger.debug('Loading', raceCount, 'races');
      logger.debug('Races:', raceArray[0].Circuit);

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
};

var loadRaceData = function*(year, race_number) {

  co(function *(){
    var races = yield Race.find({year: year}).exec();
    //console.log('races:', races, '  length:', races.length);

    for (i = 0; i < races.length; i++) {
      console.log(races[i].race_name);
    }

  });



  ////step 1 - get the race schedule for the year from db
  //var getRaceSchedule = function*(year) {
  //  logger.debug('here 2');
  //
  //  var mPromise = Race.find({
  //    year: year
  //  }).exec();
  //  yield mPromise;
  //};
  //
  //co(function *(){
  //  // yield any promise
  //  logger.debug('co ftn');
  //  //var result = yield Promise.resolve(true);
  //  var result = yield getRaceSchedule(2016);
  //  logger.debug('co ftn: ', result);
  //});


  //
  //logger.debug('here 1');
  //
  //var raceSchedule = yield getRaceSchedule(year);
  //logger.log('raceSchedule:', raceSchedule);

  //step 2 - get constructors list for race from ergast
  //ex: http://ergast.com/api/f1/2015/circuits/monza/constructors


  //step 3 - for each constructor get the drivers used at the race from ergast
  //ex: http://ergast.com/api/f1/2015/constructors/mclaren/circuits/monza/drivers

  //step 4 - save the data as race-driver records in mongo

  return 1;
};

module.exports.loadYear = loadYear;
module.exports.loadRaceData = loadRaceData;
