'use strict';

(function() {
  angular

    .module('f1Quickpick')

    .factory("MyHttp", MyHttp);

  MyHttp.$inject = ['$log','$http', '_'];

  function MyHttp($log, $http, _) {

    var HttpRequest = function(arg) {
      var isArgDefined = !_.isUndefined(arg);

      if(isArgDefined && _.isString(arg)) {
        angular.extend(this, {chunks: [arg], isHttpRequest: true });
      }
      else if(isArgDefined && _.isObject(arg) && arg.isHttpRequest ) {
        angular.extend(this, {chunks: _.cloneDeep(arg.chunks), isHttpRequest: true });
      }
      else {
        angular.extend(this, {chunks: [], isHttpRequest: true });
      }
    };

    HttpRequest.path = function(chunk) {
      return new HttpRequest(chunk)
    };

    HttpRequest.prototype.path = function(chunk) {
      this.chunks.push(chunk);
      return this ;
    };

    HttpRequest.prototype.getUrl = function() {
      return this.chunks.join('/')
    };

    HttpRequest.prototype.put = function(objectToPut) {
      var url = this.getUrl();
      return $http.put(url, objectToPut).
        then(function(response){
          return response.data
        }) ;
    };

    /**
     * perform http post operation
     * @param objectToPost
     * @param dataOnly - will return only the data object of the response object if true
     * @returns {*|{get}}
     */
    HttpRequest.prototype.post = function(objectToPost, dataOnly) {
      dataOnly = dataOnly !== false; //defaults to true

      var url = this.getUrl();
      $log.debug('Post response0');

      return $http.post(url, objectToPost).
        then(function(response){
          if(dataOnly) {
            return response.data;
          } else {
            return response;
          }
        }, function(response) {
          $log.debug('Post response error condition: ', response);
          return response;
        });

    };

    /**
     * perform http get operation
     * @param dataOnly - will return only the data object of the response object if true
     * @returns {*|{get}}
     */
    HttpRequest.prototype.get = function(dataOnly) {
      dataOnly = dataOnly !== false; //defaults to true

      var url = this.getUrl();
      return $http.get(url).
        then(function(response){
          if(dataOnly) {
            return response.data;
          } else {
            return response;
          }
        }) ;
    };

    return HttpRequest;
  }
})();
