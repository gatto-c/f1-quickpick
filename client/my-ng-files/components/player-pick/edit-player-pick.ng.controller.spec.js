describe('edit-player-pick.ng.controller.spec.js', function() {
  var $q, $compile, $scope, $window, $controller, newScope;

  beforeEach(module('f1Quickpick'));

  //beforeEach(function() {
  //  var app = angular.module('f1Quickpick', []);
  //  //app.constant('moment', moment);
  //});

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;

    //console.log($controller);
  }));

  //beforeEach(inject(function(_$q_, _$rootScope_, _$controller_, _$compile_, _$window_) {
  //  $q = _$q_;
  //  $compile = _$compile_;
  //  $window = _$window_;
  //  $controller = _$controller_;
  //  $scope = _$rootScope_;
  //  newScope = _$rootScope_.$new();
  //
  //  $controller('EditPlayerPickController', {$scope: newScope});
  //  newScope.$apply();
  //
  //  // Broadcasting from rootScope
  //  //$scope.$broadcast('announcement-data', {data: announcementData});
  //}));

  it('is a dummy test', function() {

    $scope = {};
    var controller = $controller('EditPlayerPickController', { $scope: $scope });

    // An intentionally failing test. No code within expect() will never equal 4.
    expect(2 + 2).toEqual(4);
  });
});


//describe('PasswordController', function() {
//  beforeEach(module('app'));
//
//  var $controller;
//
//  beforeEach(inject(function(_$controller_){
//    // The injector unwraps the underscores (_) from around the parameter names when matching
//    $controller = _$controller_;
//  }));
//
//  describe('$scope.grade', function() {
//    it('sets the strength to "strong" if the password length is >8 chars', function() {
//      var $scope = {};
//      var controller = $controller('PasswordController', { $scope: $scope });
//      $scope.password = 'longerthaneightchars';
//      $scope.grade();
//      expect($scope.strength).toEqual('strong');
//    });
//  });
//});
