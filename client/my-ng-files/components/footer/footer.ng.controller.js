(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .controller('appFooterController', appFooterController);

  appFooterController.$inject = ['appConfig', 'AuthService', 'moment'];

  function appFooterController(appConfig, AuthService, moment) {
    var vm = this;
    vm.overrideCurrentDate = appConfig.overrideCurrentDate ? moment(appConfig.overrideCurrentDate).utc().format('ddd MMM Do YYYY, h:mm a Z') : null;
    vm.loggedInUser = AuthService.currentUser();
    vm.placeholderText = "...";
  }
})();
