(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .controller('calendarListController', calendarListController);

  calendarListController.$inject = ['$log', 'f1QuickPickProxy', 'moment', 'appConfig'];

  function calendarListController($log, f1QuickPickProxy, moment, appConfig) {
    var vm = this;
    vm.races;


    f1QuickPickProxy.getRaceCalendar(appConfig.season).then(
      function(races) {
        //$log.debug('races: ', races);
        vm.races = races;
      },
      function(err) {
        $log.error(err);
      }
    );

  }
})();
