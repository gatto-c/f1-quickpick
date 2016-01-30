var rp = require('request-promise');
var logger = require('../../logger');
var _ = require('lodash');

//var loadYear = function*(year) {
//  logger.debug('here');
//
//  var options = {
//    url: 'http://ergast.com/api/f1/2016.json',
//    headers: { 'User-Agent': 'request' }
//  };
//
//  logger.debug('options:', options);
//
//  var response = yield request(options);
//
//  logger.debug('response:', response);
//
//  var info = JSON.parse(response.body);
//
//  logger.debug('2016 race results: ', info);
//};

var loadYear = function(year) {
  var options = {
    uri: 'http://ergast.com/api/f1/2016.json',
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };

  rp(options)
    .then(function (races) {
      var myRaces = races;
      //logger.debug('Races:', myRaces);
      var raceTable = myRaces.MRData.RaceTable
      logger.debug('Races:', raceTable.Races[3]);



      //var object = _.object(_.map(races, function (value, key) {
      //  logger.debug('key: ', key, ', value:', value);
      //  return [key, value];
      //}));
      //logger.debug('Object:', object);

      //var mappedArray = _.map(races, function (value, key) {
      //  logger.debug('key: ', key, ', value:', value);
      //  return [key, value];
      //});
      //logger.debug('mappedArray:', mappedArray);

      //var nestedArray = _.map(races, 'season');
      //logger.debug('nestedArray:', nestedArray);

      //var r = _.find(races, 'series');
      //logger.debug('found:', r['url']);

      //_.forOwn(races, function(value, key){
      //  logger.debug('value: ', value, ', key:', key);
      //})



    })
    .catch(function (err) {
      logger.error(err);
    });
};

module.exports.loadYear = loadYear;
