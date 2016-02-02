(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .service('f1QuickPickProxy', f1QuickPickProxy);

  /**
   * wrapper for all ergast based calls to ergast api
   * @param $log
   * @param MyHttp
   * @returns {{}}
   */
  function f1QuickPickProxy($log, f1QuickPickAPISAddress){
    var F1QuickPickProxy = {};
    //var raceCalendar;

    $log.debug('>>>>>>>>>>>>>>>>>>', f1QuickPickAPISAddress);

    F1QuickPickProxy.noCall = function() {
      return "";
    };

    F1QuickPickProxy.getRaceCalendar = function(year) {
      var myPromise;

      $log.info('f1QuickPickProxy.getRaceCalendar:', year);

      //myPromise = MyHttp
      //  .path(ergastAPIAddress)
      //  .path(year)
      //  .path('results.json?limit=500')
      //  .get()
      //  .catch(function () {
      //    myPromise = null
      //  });

      return myPromise;
    };

    return F1QuickPickProxy;
  }

})();

