(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('RegistrationConfirmationController', RegistrationConfirmationController);

  //inject dependencies
  RegistrationConfirmationController.$inject = ['$scope', '$routeParams'];

  function RegistrationConfirmationController($scope, $routeParams) {
    var vm = this;
    vm.username = $routeParams.username;
  }
})();

