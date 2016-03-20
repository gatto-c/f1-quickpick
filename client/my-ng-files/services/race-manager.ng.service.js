(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .service('raceManager', raceManager);


  // inject dependencies
  raceManager.$inject = ['$log', 'appConfig', 'moment', 'f1QuickPickProxy', 'Q'];

  function raceManager($log, appConfig, moment, f1QuickPickProxy, Q){
    var RaceManager = {};

    RaceManager.noCall = function() {
      return;
    };

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
      var raceDetails = {};

      f1QuickPickProxy.getRaceDetails(year, raceNumber).then(
        function(raceDetails) {
          myPromise.resolve(raceDetails)
        }
      );

      return myPromise.promise;
    };

    return RaceManager;
  }

})();


