angular

.module("f1Quickpick")

.directive('frtSample', function () {
  return {
    restrict: 'E'
    , transclude: true
    , replace: true
    , scope: true
    , controller: 'sampleCtrl'
    , templateUrl: 'components/sample/sample.ng.template.html'
  };
});

