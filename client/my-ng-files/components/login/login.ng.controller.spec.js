describe('LoginController', function() {

  var $scope, $controller, $location, $routeParams, mockAuthService, $q;

  beforeEach(function() {
    module('f1Quickpick');

    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'currentUser', 'isLoggedIn']);

    module(function($provide) {
      $provide.value('AuthService', mockAuthService);
    });
  });

  beforeEach(inject(function($rootScope, _$controller_, _$location_, _$routeParams_, _$q_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $scope = $rootScope.$new();
    $controller = _$controller_;
    $location = _$location_;
    $routeParams = _$routeParams_;
    $q = _$q_;
  }));


  describe('LoginController', function() {
    it('should have a defined controller and default data', function() {
      var $scope = {};
      var controller = $controller('LoginController', {$scope: $scope});
      expect(controller).toBeDefined();
      expect(controller.title).toBeDefined();
      expect(controller.title.length).toBeGreaterThanOrEqual(1);
    });

    it('should set empty loginForm if no user present', function() {
      var $scope = {};
      var controller = $controller('LoginController', {$scope: $scope, $routeParams: $routeParams});
      expect(controller.loginForm).toEqual({});
    });

    it('should set userName filled loginForm if user is present', function() {
      var $scope = {};
      $routeParams.username = 'userA';
      var controller = $controller('LoginController', {$scope: $scope, $routeParams: $routeParams});
      expect(controller.loginForm).toEqual({username: 'userA'});
    });

    it('should log on user successfully', function() {
      //var $scope = {};

      var controller = $controller('LoginController', {$scope: $scope, $routeParams: $routeParams, AuthService: mockAuthService});
      controller.loginForm.username = "userB";
      controller.loginForm.password = "userBPassword";

      inject(function($q) {
        mockAuthService.login.and.returnValue($q.when());
      });

      controller.login();
      $scope.$apply();
      console.log('controller.disabled:', controller.disabled);
      expect(mockAuthService.login).toHaveBeenCalled();
      expect(controller.disabled).toEqual(true);
      expect($location.path()).toBe('/');
    });
  });
});



