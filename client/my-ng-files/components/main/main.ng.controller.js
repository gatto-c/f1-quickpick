(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('MainController', MainController);

  MainController.$inject = ['$log', 'appTitle'];

  function MainController($log, appTitle) {
    var vm = this;

    vm.title = appTitle;
  }

})();
