(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .controller('appHeaderController', appHeaderController);

  appHeaderController.$inject = ['$log', 'appConfig', 'AuthService'];

    function appHeaderController($log, appConfig, AuthService) {
      var vm = this;
      vm.appTitle = appConfig.appTitle + ' ' + appConfig.season;
      vm.loggedIn = AuthService.isLoggedIn();
      vm.player = AuthService.currentUser();
    }
})();
