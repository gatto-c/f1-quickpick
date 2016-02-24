//http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.VocdH3UrJ7g
//https://thinkster.io/mean-stack-tutorial#adding-authentication-via-passport


(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .service('AuthService', AuthService);

    // inject dependencies
    AuthService.$inject = ['$q', '$log', '$window', 'MyHttp', 'appConfig'];


    /**
     * Standard authorization/registration functionality
     * @param $q - support promises
     * @param $log - used for console logging
     * @param MyHttp - proxy to rest calls
     * @param lsTokenName - the name of the token to use from local storage
     * @returns {{isLoggedIn: isLoggedIn, currentUser: currentUser, saveToken: saveToken, getToken: getToken, login: login, logout: logout, register: register}}
     * @constructor
     */
    function AuthService($q, $log, $window, MyHttp, appConfig) {
      //$log.debug('AuthService Initializing...');

      function isLoggedIn() {
        var token = getToken();

        $log.debug('isLoggedIn called, token is:', token);

        if(token){
          //var payload = JSON.parse($window.atob(token.split('.')[1]));
          var payload = angular.fromJson($window.atob(token.split('.')[1]));
          return payload.exp > Date.now() / 1000;
        } else {
          return false;
        }
      }

      function currentUser() {
        if(isLoggedIn()){
          var token = getToken();
          //var payload = JSON.parse($window.atob(token.split('.')[1]));
          var payload = angular.fromJson($window.atob(token.split('.')[1]));
          return payload.username;
        }
      }

      function saveToken(token) {
        $window.localStorage[appConfig.lsTokenName] = token;
      }

      function getToken() {
        return $window.localStorage[appConfig.lsTokenName];
      }

      /**
       * login user by passing username/password to rest proxy and ultimately rest api
       * @param username
       * @param password
       * @returns {*}
       */
      function login(username, password) {
        $log.debug('AuthService: attempting login....');

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        var myPromise = MyHttp
          .path('/login')
          .post({username: username, password: password})
          .catch(function (err) {
            $log.error(err.message);
            myPromise = null
          }
        );

        myPromise.then(function(data) {
          if(data && data.success) {
            $log.debug('AuthService: user authenticated: data: ', data);
            saveToken(data.token);
            deferred.resolve();
          } else {
            $log.debug('AuthService: user NOT authenticated, data: ', data);
            deferred.reject();
          }
        });

        // return promise object
        return deferred.promise;
      }

      /**
       * register a new user
       * @param username
       * @param password
       * @returns {*}
       */
      function register(username, password) {
        //$log.debug('AuthService: register....');

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        var myPromise = MyHttp
          .path('/register')
          .post({username: username, password: password}, false)
          .catch(function (err) {
            $log.error(err);
            myPromise = null
          }
        );

        myPromise.then(function(response) {
          //$log.debug('registration response: ', response);

          if(response && response.status == 200) {
            $log.debug('AuthService: user registered: response: ', response);
            $log.debug('AuthService: response.status: ', response.status);
            $log.debug('AuthService: response.data: ', response.data);
            $log.debug('AuthService: response.data.token: ', response.data.token);
            saveToken(response.data.token);
            deferred.resolve();
          } else {
            $log.debug('AuthService: user NOT registered(1), response: ', response);
            deferred.reject(response);
          }
        });

        // return promise object
        return deferred.promise;
      }


      /**
       * logout the currently logged in user
       * @returns {*}
       */
      function logout() {
        $log.debug('Auth service: logging out...');

        // create a new instance of deferred
        var deferred = $q.defer();

        var myPromise = MyHttp
          .path('/logout')
          .get(false, this.getToken())
          .catch(function () {
            myPromise = null
          }
        );

        myPromise.then(function(data) {
          //$log.debug('AuthService: data: ', data.status);
          if(data && data.status == 200) {
            $log.debug('Successfully logged out');
            $window.localStorage.removeItem(appConfig.lsTokenName);
            deferred.resolve();
          } else {
            $log.error('Logout error: ', data);
            deferred.reject();
          }
        });

        // return promise object
        return deferred.promise;
      }

      // return available functions for use in controllers
      return ({
        isLoggedIn: isLoggedIn,
        currentUser: currentUser,
        saveToken: saveToken,
        getToken: getToken,
        login: login,
        logout: logout,
        register: register
      });
    }
})();
