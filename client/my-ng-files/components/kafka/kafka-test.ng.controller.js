(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('KafkaTestController', KafkaTestController);

  //inject dependencies
  KafkaTestController.$inject = ['$scope', '$location', '$routeParams', '$log', 'appConfig', 'f1QuickPickProxy'];

  function KafkaTestController($scope, $location, $routeParams, $log, appConfig, proxy) {
    var vm = this;
    vm.title = appConfig.appTitle;
    vm.kafkaMsg = "";

    $log.debug('Kafka Test Controller: starting...');

    vm.submitMessage = function() {
      proxy.submitKafkaMessage(vm.kafkaMsg).then(
        function(data) {
            $log.debug('Kafka message submitted:', data);
        }
      );
    }
  }
})();

