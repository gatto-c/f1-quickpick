(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('MainController', MainController);

  MainController.$inject = ['$log', 'appConfig', '_', 'raceManager', 'f1QuickPickProxy'];

  function MainController($log, appConfig, _, raceManager, f1QuickPickProxy) {
    var vm = this;
    vm.season = appConfig.season;
    vm.raceTrio = {};
    vm.title = appConfig.appTitle;
    vm.overrideCurrentDate = appConfig.overrideCurrentDate ? appConfig.overrideCurrentDate : null;
    vm.raceTrio = raceManager.getRaceTrio();
    vm.currentPick = null;

    f1QuickPickProxy.getPlayerPick(appConfig.season, 1).then(
      function(pick) {
        $log.debug('>>>>>getting player pick');
        if(_.isEmpty(pick)) {
          $log.debug('MainController - no pick located for', appConfig.season, '/1');
        } else {
          vm.currentPick = pick;
          $log.debug('MainController - pick:', pick);
        }
      }
    );

  }
})();
