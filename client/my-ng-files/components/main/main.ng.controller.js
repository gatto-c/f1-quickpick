(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('MainController', MainController);

  MainController.$inject = ['$log', 'appConfig', '_', 'raceManager', 'f1QuickPickProxy', 'todaysDate'];

  function MainController($log, appConfig, _, raceManager, f1QuickPickProxy, todaysDate) {
    var vm = this;
    vm.season = appConfig.season;
    vm.raceTrio = {};
    vm.title = appConfig.appTitle;
    vm.currentDate = todaysDate;
    vm.currentPick = null;
    vm.playerHasPick = false;


    raceManager.getRaceTrio().then(function(raceTrio){
      vm.raceTrio = raceTrio;
      $log.debug('raceTrio.currentRace:', raceTrio.currentRace);

      f1QuickPickProxy.playerHasPick(appConfig.season, raceTrio.currentRace.race_number).then(
        function(hasPick) {
          $log.debug('MainController - Player hasPick:', hasPick);
          vm.playerHasPick = hasPick;
        }
      );

    });
  }
})();

