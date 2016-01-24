angular

  .module("f1Quickpick")

  .directive('appHeader', function() {
    return {
      restrict: 'E'
      , transclude: true
      , replace: true
      , scope: true
      , controller: 'appHeaderController'
      , controllerAs: 'vm'
      , templateUrl: 'components/header/header.ng.template.html'
    };
  });
