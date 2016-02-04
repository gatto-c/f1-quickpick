(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('MainController', MainController);

  MainController.$inject = ['$log', 'appTitle', 'f1QuickPickProxy', 'moment'];

  function MainController($log, appTitle, f1QuickPickProxy, moment) {
    var vm = this;
    vm.selected_season = 2016;
    vm.title = appTitle;

    $log.debug('Current month: ', moment().month());

    var getRaces = function(index) {
      //find the current(upcoming) race based on today's date

    };


    f1QuickPickProxy.getRaceCalendar(vm.selected_season).then(
      function(data) {
        $log.debug('race calendar: ', data);

        angular.forEach(data, function(record, index) {
          $log.debug('index:', index, ', record: ', record.race_date);



        });

      },
      function(err) {
        $log.error(err);
      }
    );




  }

})();
