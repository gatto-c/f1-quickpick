/* eslint-disable */
angular

.module("f1Quickpick")

.config(['$routeProvider',

function($routeProvider) {
  $routeProvider
  .when('/', {
      templateUrl: '/client/my-ng-files/components/main/main.ng.template.html',
      controller: 'MainController',
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
      templateUrl: '/client/my-ng-files/components/registration/registration.ng.template.html',
      controller: 'RegistrationController',
      controllerAs: 'vm',
      access: {restricted: false}
  })
  .when('/registrationConfirmation/:username', {
      templateUrl: '/client/my-ng-files/components/registration/registrationConfirmation.ng.template.html',
      controller: 'RegistrationConfirmationController',
      controllerAs: 'vm',
      access: {restricted: false}
    })
  .when('/view-player-pick/:hasplayerpick?', {
      templateUrl: '/client/my-ng-files/components/player-pick/view-player-pick.ng.template.html',
      controller: 'ViewPlayerPickController',
      controllerAs: 'vm',
      access: {restricted: true}
    })
  .when('/player-pick/:hasplayerpick?', {
      templateUrl: '/client/my-ng-files/components/player-pick/edit-player-pick.ng.template.html',
      controller: 'EditPlayerPickController',
      controllerAs: 'vm',
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
