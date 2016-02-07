angular

  .module("f1Quickpick")

  .directive('calendarList', function() {
    return {
      restrict: 'E'
      , transclude: true
      , replace: true
      , scope: true
      , controller: 'calendarListController'
      , controllerAs: 'vm'
      , templateUrl: 'components/calendar-list/calendar-list.ng.template.html'
    };
  });


