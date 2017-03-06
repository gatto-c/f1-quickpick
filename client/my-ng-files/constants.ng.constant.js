/* global moment:false Q:false */
(function() {
  angular
  .module("f1Quickpick")
  .constant("_", window._)
  .constant("moment", moment)
  .constant("Q", Q)
  .constant("todaysDate", new Date("2016-02-19T01:00:01.000Z"))
})();

