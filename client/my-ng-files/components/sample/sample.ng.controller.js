/* eslint-disable */
angular

.module("f1Quickpick")

.controller('sampleCtrl',

['$scope','SampleProxy',

function($scope,samples){

  $scope.calculate = function(){
    samples.getSample($scope.sample)
      .then(function(sample){
        $scope.calculated=sample;
      });
  }
}]);
/* eslint-enable */
