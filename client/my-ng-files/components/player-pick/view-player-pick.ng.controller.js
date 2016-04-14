(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('ViewPlayerPickController', ViewPlayerPickController);

  ViewPlayerPickController.$inject = ['$scope', '$log', 'appConfig', '$routeParams', '_', 'f1QuickPickProxy', 'raceManager'];

  function ViewPlayerPickController($scope, $log, appConfig, $routeParams, _, f1QuickPickProxy, raceManager) {
    var vm = this;
    vm.raceTrio = {};
    vm.allDrivers = {};
    vm.selectedDrivers = {};
    vm.playerPicks = {};

    /**
     * get the latest race info, build the current race's drivers list
     */
    raceManager.getRaceTrio().then(function(raceTrio){
      vm.raceTrio = raceTrio;

      raceManager.getRaceDrivers(vm.raceTrio.currentRace).then(function(drivers) {
        vm.allDrivers = drivers;
        console.log('allDrivers:', vm.allDrivers);

        f1QuickPickProxy.getPlayerPick(appConfig.season, raceTrio.currentRace.race_number).then(
          function(picks) {
            if(_.isEmpty(picks)) {
              $log.debug('ViewPlayerPickController - no pick located for season:', appConfig.season, ', race:',raceTrio.currentRace.race_number);
            } else {
              vm.playerPicks = picks[0].picks;

              vm.selectedDrivers = _.map(vm.playerPicks, function(pick){
                return _.find(vm.allDrivers, function(d) {return d.driver_id == pick});
              });

              $log.debug('ViewPlayerPickController - picks:', vm.playerPicks);
              $log.debug('ViewPlayerPickController - selectedDrivers:', vm.selectedDrivers);
            }
          }
        );

      });

    });
  }
})();


