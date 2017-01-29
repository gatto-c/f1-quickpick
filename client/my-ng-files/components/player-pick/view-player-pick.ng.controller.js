(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('ViewPlayerPickController', ViewPlayerPickController);

  ViewPlayerPickController.$inject = ['$scope', '$log', 'appConfig', '$routeParams', '_', 'f1QuickPickProxy', 'raceManager', 'moment', '$location'];

  function ViewPlayerPickController($scope, $log, appConfig, $routeParams, _, f1QuickPickProxy, raceManager, moment, $location) {
    $log.debug('>>>>>ViewPlayerPickController');

    var vm = this;
    vm.raceTrio = {};
    vm.allDrivers = {};
    vm.selectedDrivers = {};
    vm.playerPicks = {};
    vm.editAllowed = false;

    /**
     * get the latest race info, build the current race's drivers list
     */
    raceManager.getRaceTrio().then(function(raceTrio){
      vm.raceTrio = raceTrio;

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

      //allow editing only when current date < current race cutoff
      var currentDate = appConfig.overrideCurrentDate ? appConfig.overrideCurrentDate : new Date();
      currentDate = moment(currentDate);

      //$log.debug('>>>>>currentDate:', currentDate);
      //$log.debug('>>>>>>cutOffDate:', moment(vm.raceTrio.currentRace.cutoff_time));

      if(moment(vm.raceTrio.currentRace.cutoff_time).isSameOrAfter(currentDate, 'minute')) {
        vm.editAllowed = true;
      }

      raceManager.getRaceDrivers(vm.raceTrio.currentRace).then(function(drivers) {
        vm.allDrivers = drivers;
        $log.debug('allDrivers:', vm.allDrivers);

        if ($routeParams.editsaved) {
          $log.debug('>>>>>edit saved');
        }

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
      $log.debug('>>>>>editing...');
      $location.path('/edit-player-pick/true');
    }
  }
})();


