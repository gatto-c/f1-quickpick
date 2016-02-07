(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .service('f1QuickPickProxy', f1QuickPickProxy);


  // inject dependencies
  f1QuickPickProxy.$inject = ['$log', 'MyHttp', 'appConfig'];

  function f1QuickPickProxy($log, MyHttp, appConfig){
    var F1QuickPickProxy = {};
    var getRaceCalendarPromise = null;

    F1QuickPickProxy.noCall = function() {
      return;
    };

    F1QuickPickProxy.getRaceCalendar = function(year) {
      if (!getRaceCalendarPromise) {
        $log.info('f1QuickPickProxy.getRaceCalendar:', year);

        getRaceCalendarPromise = MyHttp
          .path(appConfig.apiAddress)
          .path('raceCalendar')
          .path(year)
          .get()
          .catch(function () {
            getRaceCalendarPromise = null
          });
      } else {
        $log.debug('f1QuickPickProxy: raceCalendar data already loaded');
      }

      return getRaceCalendarPromise;
    };

    return F1QuickPickProxy;
  }

})();

