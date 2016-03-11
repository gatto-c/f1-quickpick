(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('PlayerPickController', PlayerPickController);

  PlayerPickController.$inject = ['$log', 'appConfig', '$routeParams', '_', 'f1QuickPickProxy', 'raceManager'];

  function PlayerPickController($log, appConfig, $routeParams, _, f1QuickPickProxy, raceManager) {
    var vm = this;
    vm.test = 'test';
    vm.playerpick = {};
    vm.raceTrio = {};
    vm.raceDetails = {};
    vm.currentPick = {};

    vm.playerPicks = [null, null, null, null, null, null, null, null, null, null];

    vm.pickSelected = function() {
      $log.debug(vm.playerPicks);
    };

    raceManager.getRaceTrio().then(function(raceTrio){
      vm.raceTrio = raceTrio;

      raceManager.getRaceDetails(2015, 1).then(function(raceDetails) {
        vm.raceDetails = raceDetails;
        $log.debug('race:', vm.raceTrio.currentRace);
        $log.debug('raceDetails:', raceDetails);
      });


      //if the player has a pick, then retrieve it from db now
      if ($routeParams.hasplayerpick == true) {
        f1QuickPickProxy.getPlayerPick(appConfig.season, raceTrio.currentRace.race_number).then(
          function(pick) {
            if(_.isEmpty(pick)) {
              $log.debug('PlayerPickController - no pick located for season:', appConfig.season, ', race:',raceTrio.currentRace.race_number);
            } else {
              vm.currentPick = pick;
              $log.debug('PlayerPickController - pick:', pick);
            }
          }
        );
      }
    });


  }
})();

