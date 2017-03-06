(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('ViewPlayerPickController', ViewPlayerPickController);

  ViewPlayerPickController.$inject = ['$scope', '$log', 'appConfig', '$routeParams', '_', 'f1QuickPickProxy', 'raceManager', 'moment', '$location', 'todaysDate'];

  function ViewPlayerPickController($scope, $log, appConfig, $routeParams, _, f1QuickPickProxy, raceManager, moment, $location, todaysDate) {
    var vm = this;
    vm.raceTrio = {};
    vm.allDrivers = {};
    vm.selectedDrivers = {};
    vm.playerPicks = {};
    vm.todaysDate = todaysDate;

    //define array that will contain alerts to be displayed to user
    vm.alerts = [];

    //display an alert to user by adding to alert array (types=success, info, or warning)
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

    vm.editAllowed = function() {
      if(moment(vm.raceTrio.currentRace.cutoff_time).isSameOrAfter(moment.utc(vm.todaysDate), 'second')) {
        return true;
      } else {
        return false;
      }
    };

    /**
     * get the latest race info, build the current race's drivers list
     */
    raceManager.getRaceTrio().then(function(raceTrio){
      vm.raceTrio = raceTrio;

      raceManager.getRaceDrivers(vm.raceTrio.currentRace).then(function(drivers) {
        vm.allDrivers = drivers;
        $log.debug('allDrivers:', vm.allDrivers);

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

    vm.edit = function() {
      $location.path('/edit-player-pick/true');
    };

    vm.done = function() {
      $location.path('/#');
    }
  }
})();


