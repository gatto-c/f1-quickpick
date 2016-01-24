(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .controller('appFooterController', appFooterController);

  appFooterController.$inject = [];

  function appFooterController() {
    var vm = this;
    vm.placeholderText = "...";
  }
})();
