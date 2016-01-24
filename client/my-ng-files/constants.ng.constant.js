/* global moment:false */
(function() {
  angular
  .module("f1Quickpick")
  .constant("ergastAPIAddress", "http://ergast.com/api/f1")
  .constant("_", window._)
  .constant("moment", moment)
  .constant("appTitle", "F1 QuickPick")
  .constant("lsTokenName", "f1-quickpick-token") ;
})();

