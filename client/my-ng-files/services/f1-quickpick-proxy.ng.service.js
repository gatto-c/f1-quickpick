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
    var getPlayerPickPromise = null;

    F1QuickPickProxy.noCall = function() {
      return;
    };

    /**
     * Get the current season's race calendar
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
     * Get the player's pick fopr the specified year/race
     * @param year
     * @param raceNumber
     * @returns {*}
     */
    F1QuickPickProxy.getPlayerPick = function(year, raceNumber) {
      $log.info('f1QuickPickProxy.getPlayerPick: season:', year, ', race:', raceNumber);

      getPlayerPickPromise = MyHttp
        .path(appConfig.apiAddress)
        .path('player/pick')
        .path(year)
        .path(raceNumber)
        .get(null, AuthService.getToken())
        .catch(function () {
          getPlayerPickPromise = null
        });

      return getPlayerPickPromise;
    };

    return F1QuickPickProxy;
  }

})();

