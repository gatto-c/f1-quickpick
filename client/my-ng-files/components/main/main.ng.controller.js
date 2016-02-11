(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('MainController', MainController);

  MainController.$inject = ['$log', 'appConfig', 'f1QuickPickProxy', 'moment'];

  function MainController($log, appConfig, f1QuickPickProxy, moment) {
    var vm = this;
    vm.selected_season = 2016;
    vm.raceTrio = {};
    vm.title = appConfig.appTitle;

    $log.debug('Current month: ', moment().month());

    var getCurrentRaceIndex = function(races) {
      var now = moment('2016-07-25');
      //var now = moment();
      var currentRaceIndex = 0;

      //locate the next upcoming race given today's date
      for (var i = 0, len = races.length; i < len; i++) {
        var raceDate = moment(races[i].race_date);
        if(moment(raceDate).isSameOrAfter(now, 'day')) {
          $log.debug('i: ', i);
          currentRaceIndex = i;
          break;
        }
      }

      return currentRaceIndex
    };


    f1QuickPickProxy.getRaceCalendar(vm.selected_season).then(
      function(races) {
        $log.debug('races1: ', races);

        var currentRaceIndex = getCurrentRaceIndex(races);

        vm.raceTrio.currentRace = races[currentRaceIndex];
        vm.raceTrio.currentRace.race_date_formatted = moment(races[currentRaceIndex].race_date).utc().format('ddd MMMM Do YYYY, h:mm a Z');

        //first race of year
        if (currentRaceIndex == 0) {
          vm.raceTrio.previousRace = null;
          vm.raceTrio.nextRace = races[currentRaceIndex + 1];
        } else if (currentRaceIndex == races.length - 1) {
          //last race of year
          vm.raceTrio.previousRace = races[currentRaceIndex - 1];
          vm.raceTrio.nextRace = null;
        } else {
          //has previous and subsequent events
          vm.raceTrio.previousRace = races[currentRaceIndex - 1];
          vm.raceTrio.nextRace = races[currentRaceIndex + 1];
        }

        $log.debug('raceTrio: ', vm.raceTrio);

      },
      function(err) {
        $log.error(err);
      }
    );




  }

})();
