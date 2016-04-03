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
     * @param token - optional - used when posting to secure routes
     * @returns {*|{get}}
     */
    HttpRequest.prototype.post = function(objectToPost, dataOnly, token) {
      dataOnly = dataOnly !== false; //defaults to true
      var url = this.getUrl();

      //if a token is provided then specify an auth header
      var headers = token ?  {'Authorization': 'bearer ' + token} : {};

      return $http.post(url, objectToPost, {headers: headers}).
        then(function(response){
          if(dataOnly) {
            return response.data;
          } else {
            return response;
          }
        }, function(response) {
          return response;
        });

    };

    /**
     * perform http get operation
     * @param dataOnly - will return only the data object of the response object if true
     * @param token - optional - used when posting to secure routes
     * @returns {*|{get}}
     */
    HttpRequest.prototype.get = function(dataOnly, token) {
      dataOnly = dataOnly !== false; //defaults to true

      var url = this.getUrl();

      //if a token is provided then specify an auth header
      var headers = token ?  {'Authorization': 'bearer ' + token} : {};

      return $http.get(url, {headers: headers}).
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
