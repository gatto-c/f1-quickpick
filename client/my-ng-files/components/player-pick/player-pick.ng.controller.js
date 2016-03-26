(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('PlayerPickController', PlayerPickController);

  PlayerPickController.$inject = ['$scope', '$log', 'appConfig', '$routeParams', '_', 'f1QuickPickProxy', 'raceManager'];

  function PlayerPickController($scope, $log, appConfig, $routeParams, _, f1QuickPickProxy, raceManager) {
    var vm = this;
    vm.test = 'test';
    vm.playerpick = {};
    vm.raceTrio = {};
    vm.drivers = {};
    vm.currentPick = {};
    vm.duplicates = [];

    vm.playerPicks = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];

    var defaultPick = {};
    defaultPick.driver_id = "0";
    defaultPick.driver_name = "- pick driver -";

    /**
     * handle all player pick selection changes
     */
    vm.pickSelected = function() {
      //determine if there are any duplicate picks
      vm.duplicates = _.filter(vm.playerPicks, function (value, index, iteratee) {
        if (value == 0) return;
        return _.includes(iteratee, value, index + 1);
      });

      $log.debug('duplicates:', vm.duplicates);
      $log.debug('playerPicks:', vm.playerPicks);
    };

    /**
     * get the latest race info, build the current race's drivers list
     */
    raceManager.getRaceTrio().then(function(raceTrio){
      vm.raceTrio = raceTrio;

      raceManager.getRaceDrivers(vm.raceTrio.currentRace).then(function(drivers) {
        vm.drivers = drivers;
        vm.drivers.unshift(defaultPick);
        $log.debug('race:', vm.raceTrio.currentRace);
        $log.debug('drivers:', vm.drivers);
        $log.debug('playerPicks:', vm.playerPicks);

        $scope.$apply();
      });


      ////if the player has a pick, then retrieve it from db now
      //if ($routeParams.hasplayerpick == true) {
      //  f1QuickPickProxy.getPlayerPick(appConfig.season, raceTrio.currentRace.race_number).then(
      //    function(pick) {
      //      if(_.isEmpty(pick)) {
      //        $log.debug('PlayerPickController - no pick located for season:', appConfig.season, ', race:',raceTrio.currentRace.race_number);
      //      } else {
      //        vm.currentPick = pick;
      //        $log.debug('PlayerPickController - pick:', pick);
      //      }
      //    }
      //  );
      //}
    });


  }
})();

