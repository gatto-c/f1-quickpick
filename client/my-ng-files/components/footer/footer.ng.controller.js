(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .controller('appFooterController', appFooterController);

  appFooterController.$inject = ['appConfig', 'AuthService'];

  function appFooterController(appConfig, AuthService) {
    var vm = this;
    vm.overrideCurrentDate = appConfig.overrideCurrentDate ? appConfig.overrideCurrentDate : null;
    vm.loggedInUser = AuthService.currentUser();
    vm.placeholderText = "...";
  }
})();
