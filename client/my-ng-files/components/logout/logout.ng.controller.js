(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('LogoutController', LogoutController);

  //inject dependencies
  LogoutController.$inject = ['$scope', '$location', '$log', 'AuthService', 'appConfig'];

  function LogoutController($scope, $location, $log, AuthService, appConfig) {
    var vm = this;
    vm.title = appConfig.appTitle;

    vm.logout = function() {
      $log.debug('Logging out user -  current status: ', AuthService.currentUser());

      AuthService.logout()
      .then( function() {
        $location.path('/login');
      })
    }
  }
})();

