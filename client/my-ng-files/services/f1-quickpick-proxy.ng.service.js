(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .service('f1QuickPickProxy', f1QuickPickProxy);


  // inject dependencies
  f1QuickPickProxy.$inject = ['$log', 'MyHttp', 'appConfig', 'moment', 'AuthService'];

  function f1QuickPickProxy($log, MyHttp, appConfig, moment, AuthService){
    var F1QuickPickProxy = {};
    var getRaceCalendarPromise = null;

    F1QuickPickProxy.noCall = function() {
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
     * Get the current season's race calendar from Ergast
     * @returns {*}
     */
    F1QuickPickProxy.getRaceCalendar = function() {
      if (!getRaceCalendarPromise) {
        $log.info('f1QuickPickProxy.getRaceCalendar:', appConfig.season);

        getRaceCalendarPromise = MyHttp
          .path(appConfig.apiAddress)
          .path('raceCalendar')
          .path(appConfig.season)
          .get(null, AuthService.getToken())
          .catch(function () {
            getRaceCalendarPromise = null
          });
      } else {
        $log.debug('f1QuickPickProxy: raceCalendar data already loaded');
      }

      return getRaceCalendarPromise;
    };

    /**
     * Calculate and return the last, current (upcoming), and next races
     * @returns {{}}
     */
    F1QuickPickProxy.getRaceTrio = function() {
      var raceTrio = {};
      F1QuickPickProxy.getRaceCalendar().then(
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
        }
      );

      return raceTrio;
    };

    return F1QuickPickProxy;
  }

})();

