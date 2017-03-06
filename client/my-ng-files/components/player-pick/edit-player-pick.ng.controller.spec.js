describe('EditPlayerPickController', function() {
  beforeEach(module('f1Quickpick'));

  var $controller, $location;

  beforeEach(inject(function(_$controller_, _$location_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $location = _$location_;
  }));


  describe('EditPlayerPickController', function() {
    it('should have a defined controller and default picks', function() {
      var $scope = {};
      var controller = $controller('EditPlayerPickController', {$scope: $scope});
      //console.log(controller);
      expect(controller).toBeDefined();
      expect(controller.playerPicks).toEqual(['0', '0', '0', '0', '0', '0', '0', '0', '0', '0']);
    });

    it('should confirm no duplicate picks', function() {
      var $scope = {};
      var controller = $controller('EditPlayerPickController', {$scope: $scope});
      controller.playerPicks = ['driver0', 'driver1', 'driver3', 'driver4', 'driver5', 'driver6', 'driver7', 'driver8', 'driver9', 'driver10'];
      controller.pickSelected();
      expect(controller.checkForDuplicate(0)).toEqual(false);
    });

    it('should confirm a duplicate pick', function() {
      var $scope = {};
      var controller = $controller('EditPlayerPickController', {$scope: $scope});
      controller.playerPicks = ['driver0', 'driver1', 'driver3', 'driver4', 'driver5', 'driver6', 'driver3', 'driver8', 'driver9', 'driver10'];
      controller.pickSelected();
      expect(controller.checkForDuplicate(2)).toEqual(true);
    });

    it('should reset user picks', function() {
      var $scope = {};
      var controller = $controller('EditPlayerPickController', {$scope: $scope});
      controller.playerPicks = ['driver0', 'driver1', 'driver3', 'driver4', 'driver5', 'driver6', 'driver7', 'driver8', 'driver9', 'driver10'];
      controller.pickSelected();
      expect(controller.playerPicks).toEqual(['driver0', 'driver1', 'driver3', 'driver4', 'driver5', 'driver6', 'driver7', 'driver8', 'driver9', 'driver10']);
      controller.reset();
      expect(controller.playerPicks).toEqual(['0', '0', '0', '0', '0', '0', '0', '0', '0', '0']);
    });

    it('should redirect user to view-player-pick when cancelled', function() {
      var $scope = {};
      var controller = $controller('EditPlayerPickController', {$scope: $scope});
      controller.cancel();
      expect($location.path()).toBe('/view-player-pick/true');
    });
  });

});



