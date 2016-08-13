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
    };

    /**
     * Get the current season's race calendar
     * @returns {*}
     */
    F1QuickPickProxy.getRaceCalendar = function() {
      if (!getRaceCalendarPromise) {
        //$log.info('f1QuickPickProxy.getRaceCalendar:', appConfig.season);

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
     * Determine if the logged in player has a pick for the specified year/race#
     * @param year
     * @param raceNumber
     * @returns {*}
     */
    F1QuickPickProxy.playerHasPick = function(year, raceNumber) {
      var myPromise;
      $log.info('f1QuickPickProxy.playerHasPick: season:', year, ', race:', raceNumber);

      myPromise = MyHttp
        .path(appConfig.apiAddress)
        .path('player/hasPick')
        .path(year)
        .path(raceNumber)
        .get(null, AuthService.getToken())
        .catch(function () {
          myPromise = null
        });

      return myPromise;
    };

    /**
     * Get the player's pick fopr the specified year/race
     * @param year
     * @param raceNumber
     * @returns {*}
     */
    F1QuickPickProxy.getPlayerPick = function(year, raceNumber) {
      var myPromise;
      $log.debug('f1QuickPickProxy.getPlayerPick: season:', year, ', race:', raceNumber);

      myPromise = MyHttp
        .path(appConfig.apiAddress)
        .path('player/pick')
        .path(year)
        .path(raceNumber)
        .get(null, AuthService.getToken())
        .catch(function () {
          myPromise = null
        });

      return myPromise;
    };

    /**
     * Get the race details for a specific year/race #
     * @param year - year of race
     * @param raceNumber - the number of the race
     * @returns {*}
     */
    F1QuickPickProxy.getRaceDetails = function(year, raceNumber) {
      var myPromise;
      $log.debug('f1QuickPickProxy.getRaceDetails: season:', year, ', race:', raceNumber);

      myPromise = MyHttp
        .path(appConfig.apiAddress)
        .path('raceDetails')
        .path(year)
        .path(raceNumber)
        .get(null, AuthService.getToken())
        .catch(function () {
          myPromise = null
        });

      return myPromise;
    };

    F1QuickPickProxy.submitPlayerPicks = function(year, raceNumber, picks) {
      var myPromise;

      myPromise = MyHttp
        .path(appConfig.apiAddress)
        .path('player')
        .path('pick')
        .post({year: year, raceNumber: raceNumber, picks: picks}, false, AuthService.getToken())
        .catch(function () {
          myPromise = null
        });

      return myPromise;
    };

    F1QuickPickProxy.submitKafkaMessage = function(message) {
      var myPromise;

      myPromise = MyHttp
        .path(appConfig.apiAddress)
        .path('kafka')
        .path('submit-message')
        .post({message: message}, false, AuthService.getToken())
        .catch(function () {
          myPromise = null
        });

      return myPromise;
    };


    return F1QuickPickProxy;
  }

})();

