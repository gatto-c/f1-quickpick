(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .service('playerManager', playerManager);


  // inject dependencies
  playerManager.$inject = ['$log', 'appConfig', '_', 'f1QuickPickProxy'];

  function playerManager($log, appConfig, _, f1QuickPickProxy){
    var PlayerManager = {};

    PlayerManager.noCall = function() {
      return;
    };

    /**
     * Using httpProxy service get the player's pick for the specified year/race
     * @param year
     * @param raceNumber
     */
    PlayerManager.getPlayerPick = function(year, raceNumber) {
      var playerPick = {};

      f1QuickPickProxy.getPlayerPick(year, raceNumber).then(
        function(pick) {
          if (_.isEmpty(pick)) {
            $log.debug('playerManager could not locate a pick for ', year, '/', raceNumber);
          } else {
            $log.debug('playerManager received player pick from server: ', pick);
          }
          playerPick = pick;
        }
      );

      return playerPick;
    };

    return PlayerManager;
  }

})();


