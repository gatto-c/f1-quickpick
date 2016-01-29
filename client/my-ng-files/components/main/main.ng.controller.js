(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('MainController', MainController);

  MainController.$inject = ['$log', 'appTitle'];

  function MainController($log, appTitle) {
    var vm = this;

    vm.selected_season = 2016;

    vm.title = appTitle;
  }

})();
