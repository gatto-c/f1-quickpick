(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .service('raceManager', raceManager);


  // inject dependencies
  raceManager.$inject = ['$log', 'appConfig', 'moment', 'f1QuickPickProxy', 'Q', '$resource', '_'];

  function raceManager($log, appConfig, moment, f1QuickPickProxy, Q, $resource, _){
    var RaceManager = {};

    RaceManager.noCall = function() {
    };

    function getFlags() {
      var myPromise = Q.defer();

      $resource('/static/nationality-flags.json').get(function(data) {
        myPromise.resolve(data);
      });

      return myPromise.promise;
    }

    /**
     * determines the index of the upcoming race given the current date
     * @param races
     * @returns {number}
     */
    var getCurrentRaceIndex = function(races) {
      var now = appConfig.overrideCurrentDate ? moment(appConfig.overrideCurrentDate) : moment();
      var currentRaceIndex = -1;

      //locate the next upcoming race given today's date
      for (var i = 0, len = races.length; i < len; i++) {
        var raceDate = moment(races[i].race_date);

        if(moment(raceDate).isSameOrAfter(now, 'day')) {
          currentRaceIndex = i;
          break;
        }
      }

      return currentRaceIndex
    };

    /**
     * Calculate and return the last, current (upcoming), and next races
     * @returns {{}}
     */
    RaceManager.getRaceTrio = function() {
      var myPromise = Q.defer();
      var raceTrio = {};

      f1QuickPickProxy.getRaceCalendar().then(
        function(races) {
          var currentRaceIndex = getCurrentRaceIndex(races);
          if (currentRaceIndex == -1) return;

          raceTrio.currentRace = races[currentRaceIndex];
          raceTrio.currentRace.race_date_formatted = moment(races[currentRaceIndex].race_date).utc().format('ddd MMMM Do YYYY, h:mm a Z');

          //first race of year
          if (currentRaceIndex == 0) {
            raceTrio.previousRace = null;
            raceTrio.nextRace = races[currentRaceIndex + 1];
          } else if (currentRaceIndex == races.length - 1) {
            //last race of year
            raceTrio.previousRace = races[currentRaceIndex - 1];
            raceTrio.nextRace = null;
          } else {
            //has previous and subsequent events
            raceTrio.previousRace = races[currentRaceIndex - 1];
            raceTrio.nextRace = races[currentRaceIndex + 1];
          }

          myPromise.resolve(raceTrio)
        }
      );

      return myPromise.promise;
    };

    /**
     * Calls proxy service to get race details for specified year/race#
     * @param year
     * @param raceNumber
     * @returns {*}
     */
    RaceManager.getRaceDetails = function(year, raceNumber) {
      var myPromise = Q.defer();

      f1QuickPickProxy.getRaceDetails(year, raceNumber).then(
        function(raceDetails) {
          myPromise.resolve(raceDetails)
        }
      );

      return myPromise.promise;
    };

    /**
     * Given a race object extract the drivers into a flatten object array including flag of nationality
     * @param race - the race db object
     */
    RaceManager.getRaceDrivers = function(race) {
      var myPromise = Q.defer();

      getFlags().then(function(promise){
        var flags = promise.flags;

        //race contains constructors array, which contains drivers array - extract drivers into array
        var raceDrivers = _.chain(_.map(race.constructors, function(value) {
          var constructor = value;
          return _.map(value.drivers, function(value) {
            var flag = _.find(flags, function(f) {return f.nationality == value.driver_nationality});
            return {driver_name: value.driver_name, driver_id: value.driver_id, driver_code: value.driver_code, driver_nationality: value.driver_nationality, driver_flag: flag.flag_sm, constructor_name: constructor.constructor_name};
          })
        })).flatten().value();

        myPromise.resolve(raceDrivers);
      });

      return myPromise.promise;
    };

    /**
     * Submit the player's picks to backend
     * @param year - race season year
     * @param raceNumber - number of race
     * @param picks - player's picks
     * @returns {*}
     */
    RaceManager.submitPlayerPicks = function(year, raceNumber, picks) {
      var myPromise = Q.defer();

      validatePlayerPicks(picks, function(err, msg) {
        if (err) {
          myPromise.reject(msg);
        } else {
          f1QuickPickProxy.submitPlayerPicks(year, raceNumber, picks).then(
            function(result) {
              myPromise.resolve(result);
            }
          );
        }
      });

      return myPromise.promise;
    };

    /**
     * validate the player's picks prior to attempting save to backend
     * @param picks - the player's picks
     * @param next
     * @returns {*}
     */
    function validatePlayerPicks(picks, next) {
      //make sure there are 10 picks
      var nullPick = _.find(picks, function(p){return p == "0"});
      if (nullPick > -1) {
        return next('error', 'You must select 10 drivers');
      }

      //make sure there are no duplicate picks
      var duplicates = _.filter(picks, function (value, index, iteratee) {
        return _.includes(iteratee, value, index + 1);
      });
      if (duplicates.length > 0) {
        return next('error', 'You must have no duplicate picks');
      }

      //make sure all picks are unique
      next(null, 'picks valid');
    }

    return RaceManager;
  }


})();


