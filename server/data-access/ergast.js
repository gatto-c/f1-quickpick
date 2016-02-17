var Race = require('../models/race');
var RaceDriver = require('../models/race-driver');
var co = require('co');
var request = require('koa-request');
var config = require('../../config').getConfig();

/**
 * Get the race calendar for the specified season
 * @param year - the season's year
 * @returns {*}
 */
module.exports.getRaceCalendar = function*(year) {
//  return co(function *(){
    //load particulars for calling ergast season-calendar api
    var options = {
      uri: 'http://ergast.com/api/f1/' + year + '.json',
      headers: {
        'User-Agent': 'request'
      },
      json: true // Automatically parses the JSON string in the response
    };

    //get the season data from ergast
    var response = yield request(options);
    return response.body.MRData.RaceTable.Races;
//  });
};

/**
 * Get the constructors for a specific race
 * @param year - year of race
 * @param circuit_id - the circuit_id we want constructors race data for
 * @returns {*}
 */
module.exports.getRaceConstructors = function*(year, circuit_id) {
//  return co(function *(){
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
//  });
};

/**
 * Get the drivers for each constructor for the specified race
 * @param year - the year of the race
 * @param circuit_id - the id of the race circuit
 * @param constructor_id - the id of the constructor we want
 * @returns {*}
 */
module.exports.getRaceConstructorDrivers = function*(year, circuit_id, constructor_id) {
//  return co(function *(){
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
 // });
};
