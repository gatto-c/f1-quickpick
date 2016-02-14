var rp = require('request-promise');
var logger = require('../../logger');
var _ = require('lodash');
var co = require('co');
var Race = require('../models/race');
var config = require('../../config').production;
var Promise = require('promise');

/**
 * Aquire and save race calendar data for a given year
 * @param year
 */
var loadYear = function(year) {
  var count;
  co(function *(){
    //make sure ther aren't already races loaded for the year
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
 * Aquire and save race data (drivers and constructors) for a specific race event
 * @param year - year of the race season
 * @param race_number - the number of the season's race
 * @returns {number}
 */
var loadRaceData = function*(year, race_number) {
  co(function *(){
    //step 1 - get the race schedule for the year from db
    var races = yield Race.find({year: year}).exec();
    if (!races || races.length <= 0) {
      logger.debug();
    }
    //console.log('races:', races, '  length:', races.length);
    //for (i = 0; i < races.length; i++) {
    //  console.log(races[i].race_name);
    //}

    //step 2 - get constructors list for race from ergast
    //ex: http://ergast.com/api/f1/2015/circuits/monza/constructors
    var constructors;
    ergastGetRaceConstructors(year, 1).then(function(data){
      constructors = data;
      //console.log('>>>>>data2: ', data.MRData.ConstructorTable);
      console.log('>>>>>data2: ', data.MRData.ConstructorTable.Constructors);
    });

    console.log('>>>>>constructors: ', constructors);



  });






  //step 3 - for each constructor get the drivers used at the race from ergast
  //ex: http://ergast.com/api/f1/2015/constructors/mclaren/circuits/monza/drivers

  //step 4 - save the data as race-driver records in mongo

  return 1;
};

var ergastGetRaceConstructors = function(year, race_number) {
    //load particulars for calling ergast race/constructors api
    year = 2015;
    var options = {
      uri: config.ergastAPIAddress + year + '/circuits/monza/constructors' + '.json',
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };

    //get the season data from ergast
    return rp(options);
};

module.exports.loadYear = loadYear;
module.exports.loadRaceData = loadRaceData;
