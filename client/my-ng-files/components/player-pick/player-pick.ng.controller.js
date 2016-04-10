(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('PlayerPickController', PlayerPickController);

  PlayerPickController.$inject = ['$scope', '$log', 'appConfig', '$routeParams', '_', 'f1QuickPickProxy', 'raceManager'];

  function PlayerPickController($scope, $log, appConfig, $routeParams, _, f1QuickPickProxy, raceManager) {
    var vm = this;
    vm.playerpick = {};
    vm.raceTrio = {};
    vm.drivers = {};
    vm.currentPick = {};
    vm.duplicates = [];
    vm.playerPicks = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]; //array contains all user's picks (defaults to the default 'pick driver' selection (0)

    //create a default pick which will be applied to top of drivers list array
    var defaultPick = {};
    defaultPick.driver_id = "0";
    defaultPick.driver_name = "- pick driver -";

    //define array that will contain alerts to be displayed to user
    vm.alerts = [];

    //display an alert to user by adding to alery array (types=success, info, or warning)
    vm.addAlert = function(type, message) {
      //only display one alert at a time (for now)
      vm.alerts = [];
      vm.alerts.push({type: type, msg: message});
      $scope.$apply();
    };

    //close the alert at specified alert array index
    vm.closeAlert = function(index) {
      vm.alerts.splice(index, 1);
    };

    /**
     * using the pick at the passed index look for a duplicate selection in the playerPicks array
     * @param pickNum - the index of the user's pick in the playerPicks array
     * @returns {boolean} - true if duplicate pick exists, false if not
     */
    vm.checkForDuplicate = function(pickNum) {
      if(vm.playerPicks[pickNum] == 0) return false;
      var result = _.findIndex(vm.duplicates, function(d) { return d == vm.playerPicks[pickNum] });
      return result > -1;
    };

    /**
     * handle all player pick selection changes
     */
    vm.pickSelected = function() {
      //record any duplicate picks in the 'duplicates' var
      vm.duplicates = _.filter(vm.playerPicks, function (value, index, iteratee) {
        if (value == 0) return;
        return _.includes(iteratee, value, index + 1);
      });
    };

    /**
     * Submit player picks to server/db
     */
    vm.submit = function() {
      raceManager.submitPlayerPicks(vm.raceTrio.currentRace.year, vm.raceTrio.currentRace.race_number, vm.playerPicks).then(function(result){
        if (result.status != 200) {
          vm.addAlert('warning', result.data);
        } else {
          vm.addAlert('success', 'Player pick saved');
        }
      }).fail(function(err) {
        vm.addAlert('warning', err);
      })
    };

    vm.reset = function() {
      vm.playerPicks = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    };

    /**
     * get the latest race info, build the current race's drivers list
     */
    raceManager.getRaceTrio().then(function(raceTrio){
      vm.raceTrio = raceTrio;

      raceManager.getRaceDrivers(vm.raceTrio.currentRace).then(function(drivers) {
        vm.drivers = drivers;
        vm.drivers.unshift(defaultPick); //apply default pick to top of array

        //$log.debug('race:', vm.raceTrio.currentRace);
        //$log.debug('drivers:', vm.drivers);
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

