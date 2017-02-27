(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .controller('appFooterController', appFooterController);

  appFooterController.$inject = ['appConfig', 'AuthService', 'moment', 'todaysDate'];

  function appFooterController(appConfig, AuthService, moment, todaysDate) {
    var vm = this;
    vm.currentDate = moment.utc(todaysDate).format('ddd MMM Do YYYY, h:mm a Z');
    vm.loggedInUser = AuthService.currentUser();
    vm.placeholderText = "...";
  }
})();
