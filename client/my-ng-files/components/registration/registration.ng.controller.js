(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('RegistrationController', RegistrationController);

  //inject dependencies
  RegistrationController.$inject = ['$scope', '$location', '$log', 'AuthService', 'appConfig'];

  function RegistrationController($scope, $location, $log, AuthService, appConfig) {
    var vm = this;
    vm.title = appConfig.appTitle;

    vm.registerForm = {
      username: "",
      password: "",
      confirmPassword: ""
    };
    //vm.registerForm.username = 'user1';
    //vm.registerForm.password = 'abc123';

    $log.debug('Registration - current user status: ', AuthService.currentUser());

    vm.register = function () {
      $log.debug('Registering new player: vm: ', vm.registerForm.username);

      // initial values
      vm.error = false;
      vm.disabled = true;

      // call register from service
      AuthService.register(vm.registerForm.username, vm.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/registrationConfirmation/' + vm.registerForm.username); //$location.path('/login');
          vm.disabled = false;
          vm.registerForm = {};
        })
        // handle error
        .catch(function (err) {
          $log.debug('err: ', err);
          vm.error = true;
          vm.errorMessage = (err.status == 409) ? "Username " + vm.registerForm.username + " already exists. Please use another." : "We're sorry, we are unable to register you at this time. Please try again later.";
          vm.disabled = false;
          vm.registerForm = {};
        });
    };
  }
})();
