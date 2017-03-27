(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('LoginController', LoginController);

    //inject dependencies
    LoginController.$inject = ['$scope', '$location', '$routeParams', '$log', 'AuthService', 'appConfig'];

    function LoginController($scope, $location, $routeParams, $log, AuthService, appConfig) {
      var vm = this;
      vm.title = appConfig.appTitle;

      if ($routeParams.username) {
        vm.loginForm = {username: $routeParams.username};
      } else {
        vm.loginForm = {};
      }
      //vm.loginForm = {username: 'user1', password: 'abc123'};

      $log.debug('Login Controller: getUserStatus: ', AuthService.currentUser());


      vm.login = function () {
        console.log('>>>>>vm.login()...');
        $log.debug('Attempting Login: ', vm.loginForm);

        // initial values
        vm.error = false;
        vm.disabled = true;

        // call login from service
        AuthService.login(vm.loginForm.username, vm.loginForm.password)
          // handle success
          .then(function () {
            console.log('>>>>>login success');
            $log.debug('loginCtrl: user logged in');
            $location.path('/');
            vm.disabled = false;
            vm.loginForm = {};
          })
          // handle error
          .catch(function () {
            console.log('>>>>>login error');
            $log.debug('loginCtrl: login error: Invalid username and/or password');
            vm.error = true;
            vm.errorMessage = "Invalid username and/or password";
            vm.disabled = false;
          });
      };
    }
})();
