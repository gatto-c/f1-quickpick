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
    vm.raceDetails = {};
    vm.currentPick = {};

    vm.playerPicks = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];

    var defaultPick = {};
    defaultPick.driver_id = "0";
    defaultPick.driver_name = "- pick driver -";

    vm.pickSelected = function() {
      $log.debug('playerPicks:', vm.playerPicks);
    };



    raceManager.getRaceTrio().then(function(raceTrio){
      vm.raceTrio = raceTrio;

      raceManager.getRaceDetails(vm.raceTrio.currentRace.year, vm.raceTrio.currentRace.race_number).then(function(raceDetails) {
        $log.debug('Race Details1:', raceDetails);

        var drivers = _.chain(_.map(raceDetails.constructors, function(value, key) {
          return _.map(value.drivers, function(value, key) {
            console.log(value.driver_name);
            return value.driver_name;
          })
        })).flatten().value();

        console.log('drivers:', drivers);

        //raceDetails.unshift(defaultPick);
        //$log.debug('Race Details2:', raceDetails);
        //vm.raceDetails = raceDetails;
        //$log.debug('race:', vm.raceTrio.currentRace);
        //$log.debug('raceDetails:', raceDetails);
        //$log.debug('playerPicks:', vm.playerPicks);
        //$scope.$apply();
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

