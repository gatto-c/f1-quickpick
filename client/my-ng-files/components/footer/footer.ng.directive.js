angular

  .module("f1Quickpick")

  .directive('appFooter', function() {
    return {
      restrict: 'E'
      , transclude: true
      , replace: true
      , scope: true
      , controller: 'appFooterController'
      , controllerAs: 'vm'
      , templateUrl: 'components/footer/footer.ng.template.html'
    };
  });

