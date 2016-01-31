var rp = require('request-promise');
var logger = require('../../logger');
var _ = require('lodash');
var Race = require('../models/race');

/**
 * Aquire and save race calendar data
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
            race_locale: r.Circuit.Location.locality,
            race_country: r.Circuit.Location.country,
            race_date: new Date(r.date + 'T' + r.time)
          });

          race.save(function (err) {
            if (err) {
              return err;
            }
            else {
              logger.log('info', 'Race saved: ', race.race_name);
            }
          });
        }
      }




    })
    .catch(function (err) {
      logger.error(err);
    });
};

module.exports.loadYear = loadYear;
