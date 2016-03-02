(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('PlayerPickController', PlayerPickController);

  PlayerPickController.$inject = ['$log', 'appConfig', '$routeParams', 'f1QuickPickProxy', '_'];

  function PlayerPickController($log, appConfig, $routeParams, f1QuickPickProxy, _) {
    var vm = this;
    vm.test = 'test';
    vm.playerpick = {};

    if ($routeParams.hasplayerpick == true) {
      f1QuickPickProxy.getPlayerPick(appConfig.season, 1).then(
        function(pick) {
          if(_.isEmpty(pick)) {
            $log.debug('PlayerPickController - no pick located for', appConfig.season, '/1');
          } else {
            vm.currentPick = pick;
            $log.debug('PlayerPickController - pick:', pick);
          }
        }
      );
    }

  }
})();

