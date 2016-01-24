angular

  .module("f1Quickpick")

  .directive('wjValidationError', function() {
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ctl) {
        scope.$watch(attrs['wjValidationError'], function (errorMsg) {
          //console.log('>>>>>>>>>passwords match?: ', (errorMsg ? false : true));
          elm[0].setCustomValidity(errorMsg);
          ctl.$setValidity('wjValidationError', errorMsg ? false : true);
        });
      }
    };
  });
