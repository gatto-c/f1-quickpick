/* eslint-disable */
angular

.module("f1Quickpick")

.config(['$routeProvider',

function($routeProvider) {
  $routeProvider
  .when('/', {
      templateUrl: '/client/my-ng-files/components/welcome/welcome.ng.template.html',
      controller: 'WelcomeController',
      controllerAs: 'vm',
      access: {restricted: true}
  })
  .when('/login/:username?', {
    templateUrl: '/client/my-ng-files/components/login/login.ng.template.html',
    controller: 'LoginController',
    controllerAs: 'vm',
    access: {restricted: false}
  })
  .when('/logout', {
      controller: 'LogoutController',
      controllerAs: 'vm',
      access: {restricted: true}
  })
  .when('/register', {
      templateUrl: '/client/my-ng-files/components/register/register.ng.template.html', //templateUrl: '/client/my-ng-files/components/registration/registration.ng.template.html',
      controller: 'RegisterController', //'RegistrationController',
      controllerAs: 'vm',
      access: {restricted: false}
  })
  .when('/registrationConfirmation/:username', {
      templateUrl: '/client/my-ng-files/components/register/registrationConfirmation.ng.template.html',
      controller: 'RegistrationConfirmationController',
      controllerAs: 'vm',
      access: {restricted: false}
    })
  .when('/one', {
      template: '<h1>This is page one!</h1>',
      access: {restricted: true}
   })
  .when('/two', {
      template: '<h1>This is page two!</h1>',
      access: {restricted: true}
   })
  .otherwise({
    redirectTo: '/'
  });
}]);
/* eslint-enable */
