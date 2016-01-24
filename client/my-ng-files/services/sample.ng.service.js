/* eslint-disable angular/di */
angular

.module("f1Quickpick")

.service('SampleProxy',

['$log', 'MyHttp',

function($log, MyHttp) {
  var SampleProxy = {};

  var samplePromise;

  SampleProxy.getSample = function(id) {
    $log.info('SampleProxy.getSample');

    samplePromise = MyHttp
      .path('rest')
      .path('samples')
      .path(id)
      .get()
      .catch(function () {
        samplePromise = null
      });

    return samplePromise;
  };

  return SampleProxy;
}]);
/* eslint-enable angular/di */
