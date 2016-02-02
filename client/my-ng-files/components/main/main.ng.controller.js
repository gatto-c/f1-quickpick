(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('MainController', MainController);

  MainController.$inject = ['$log', 'appTitle', 'f1QuickPickProxy'];

  function MainController($log, appTitle, f1QuickPickProxy) {
    var vm = this;

    //f1QuickPickProxy.noCall();

    //var d = "ddddddddddd";

    vm.selected_season = 2016;

    vm.title = appTitle;
  }

})();
