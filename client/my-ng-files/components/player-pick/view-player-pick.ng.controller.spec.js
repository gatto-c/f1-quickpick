describe('ViewPlayerPickController', function() {
  beforeEach(module('f1Quickpick'));

  var $controller, $location, todaysDate;

  beforeEach(inject(function(_$controller_, _$location_, _todaysDate_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
    $location = _$location_;
    todaysDate = _todaysDate_;
  }));


  describe('ViewPlayerPickController', function() {
    it('should have a defined controller and default picks', function() {
      var $scope = {};
      var controller = $controller('ViewPlayerPickController', {$scope: $scope});
      //console.log(controller);
      expect(controller).toBeDefined();
      expect(controller.playerPicks).toEqual({});
    });

    it('should not allow editing of picks if todays date falls on or after cutoff date', function() {
      var $scope = {};
      var controller = $controller('ViewPlayerPickController', {$scope: $scope});
      expect(controller).toBeDefined();

      controller.todaysDate = new Date('Mar 6, 2017 18:44:14');
      controller.raceTrio = {currentRace: {cutoff_time: new Date('Mar 5, 2017 11:59:59')}};
      expect(controller.editAllowed()).toEqual(false);

      controller.todaysDate = new Date('Mar 5, 2017 12:00:01');
      controller.raceTrio = {currentRace: {cutoff_time: new Date('Mar 5, 2017 12:00:00')}};
      expect(controller.editAllowed()).toEqual(false);
    });

    it('should allow editing of picks if todays date falls before cutoff date', function() {
      var $scope = {};
      var controller = $controller('ViewPlayerPickController', {$scope: $scope});
      expect(controller).toBeDefined();

      controller.todaysDate = new Date('Feb 28, 2017 23:59:59');
      controller.raceTrio = {currentRace: {cutoff_time: new Date('Mar 1, 2017 00:00:00')}};
      expect(controller.editAllowed()).toEqual(true);

      controller.todaysDate = new Date('Dec 24, 2016 18:16:22');
      controller.raceTrio = {currentRace: {cutoff_time: new Date('Jan 4, 2017 00:00:00')}};
      expect(controller.editAllowed()).toEqual(true);
    });

    it('should redirect user to edit-player-pick when edit called', function() {
      var $scope = {};
      var controller = $controller('ViewPlayerPickController', {$scope: $scope});
      controller.edit();
      expect($location.path()).toBe('/edit-player-pick/true');
    });

    it('should redirect user to default site location when done called', function() {
      var $scope = {};
      var controller = $controller('ViewPlayerPickController', {$scope: $scope});
      controller.done();
      expect($location.path()).toBe('/#');
    });
  });

});




