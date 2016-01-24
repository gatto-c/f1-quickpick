(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('RegistrationController', RegistrationController);

  //inject dependencies
  RegistrationController.$inject = ['$scope', '$location', '$log', 'AuthService', 'appTitle'];

  function RegistrationController($scope, $location, $log, AuthService, appTitle) {
    var vm = this;
    vm.title = appTitle;
    vm.registerForm = {};
  }
})();
