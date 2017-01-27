;(function() {
"use strict";

/*eslint-disable no-console*/

angular.module("f1Quickpick", [
    'ngMessages'
  , 'ngCookies'
  , 'ngRoute'
  , 'ngResource'
  , 'mm.foundation'
]);

angular
  .module("f1Quickpick")

  .run(['$rootScope', '$log', '$location', '$route', 'AuthService',
    function($rootScope, $log, $location, $route, AuthService) {
      $log.debug('Running pre-code');

      // listen for route changes and determine if authorization needs to be provided
      /*eslint-disable no-unused-vars*/
      var onRouteChangeStartBroadcast = $rootScope.$on('$routeChangeStart', function (event, next, current) {
        $log.debug('User logged in: ', AuthService.isLoggedIn());

        //console.log('next:', next, ', logged-in:', AuthService.isLoggedIn());

        if (next.access.restricted && AuthService.isLoggedIn() === false) {
          $log.debug('Auth route check - access not granted: ', {'restricted': next.access.restricted, 'user logged in': AuthService.isLoggedIn()});
          $location.path('/login');
          $route.reload();
        } else {
          $log.debug('Auth route check - access granted: ', {'restricted': next.access.restricted, 'user logged in': AuthService.isLoggedIn()});
        }
      });
      /*eslint-enable no-unused-vars*/

      //remove the broadcast subscription when scope is destroyed
      $rootScope.$on('$destroy', function() {
        $log.debug('onRouteChangeStartBroadcast destroyed');
        onRouteChangeStartBroadcast();
      });
    }
  ]);
}());

;(function() {
"use strict";

/* global moment:false Q:false */
(function() {
  angular
  .module("f1Quickpick")
  .constant("_", window._)
  .constant("moment", moment)
  .constant("Q", Q)
})();
}());

;(function() {
"use strict";

angular.module("f1Quickpick")

.constant("appConfig", {
	"env": "development",
	"appTitle": "F1 QuickPick (dev)",
	"lsTokenName": "f1-quickpick-token",
	"season": 2015,
	"apiAddress": "http://localhost:8080",
	"ergastAPIAddress": "http://ergast.com/api/f1",
	"overrideCurrentDate": "2015-03-13T01:01:30.000Z"
})

;
}());

;(function() {
"use strict";

/* eslint-disable */
angular

.module("f1Quickpick")

.config(['$routeProvider',

function($routeProvider) {
  $routeProvider
  .when('/', {
      templateUrl: '/client/my-ng-files/components/main/main.ng.template.html',
      controller: 'MainController',
      controllerAs: 'vm',
      access: {restricted: true}
  })
  .when('/login/:username?', {
    templateUrl: '/client/my-ng-files/components/login/login.ng.template.html',
    controller: 'LoginController',
    controllerAs: 'vm',
    access: {restricted: false}
  })
  .when('/logout', {
      controller: 'LogoutController',
      controllerAs: 'vm',
      access: {restricted: true}
  })
  .when('/register', {
      templateUrl: '/client/my-ng-files/components/registration/registration.ng.template.html',
      controller: 'RegistrationController',
      controllerAs: 'vm',
      access: {restricted: false}
  })
  .when('/registrationConfirmation/:username', {
      templateUrl: '/client/my-ng-files/components/registration/registrationConfirmation.ng.template.html',
      controller: 'RegistrationConfirmationController',
      controllerAs: 'vm',
      access: {restricted: false}
    })
  .when('/view-player-pick/:hasplayerpick?', {
      templateUrl: '/client/my-ng-files/components/player-pick/view-player-pick.ng.template.html',
      controller: 'ViewPlayerPickController',
      controllerAs: 'vm',
      access: {restricted: true}
    })
  .when('/edit-player-pick/:hasplayerpick?', {
      templateUrl: '/client/my-ng-files/components/player-pick/edit-player-pick.ng.template.html',
      controller: 'EditPlayerPickController',
      controllerAs: 'vm',
      access: {restricted: true}
   })
  .when('/two', {
      template: '<h1>This is page two!</h1>',
      access: {restricted: true}
   })
  .otherwise({
    redirectTo: '/'
  });
}]);
/* eslint-enable */
}());

;(function() {
"use strict";

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
}());

;(function() {
"use strict";

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

        //$log.debug('isLoggedIn called, token is:', token);

        if(token){
          //var header = angular.fromJson($window.atob(token.split('.')[0]));
          var payload = angular.fromJson($window.atob(token.split('.')[1]));
          //$log.debug('header:', header);
          //$log.debug('payload:', payload);
          //$log.debug('>>>>>payload.exp:', payload.exp, ', date.now:', (Date.now() / 1000), ', returning: ', (payload.exp > Date.now() / 1000));

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
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .service('f1QuickPickProxy', f1QuickPickProxy);


  // inject dependencies
  f1QuickPickProxy.$inject = ['$log', 'MyHttp', 'appConfig', 'moment', 'AuthService'];

  function f1QuickPickProxy($log, MyHttp, appConfig, moment, AuthService){
    var F1QuickPickProxy = {};
    var getRaceCalendarPromise = null;

    F1QuickPickProxy.noCall = function() {
    };

    /**
     * Get the current season's race calendar
     * @returns {*}
     */
    F1QuickPickProxy.getRaceCalendar = function() {
      if (!getRaceCalendarPromise) {
        //$log.info('f1QuickPickProxy.getRaceCalendar:', appConfig.season);

        getRaceCalendarPromise = MyHttp
          .path(appConfig.apiAddress)
          .path('raceCalendar')
          .path(appConfig.season)
          .get(null, AuthService.getToken())
          .catch(function () {
            getRaceCalendarPromise = null
          });
      } else {
        $log.debug('f1QuickPickProxy: raceCalendar data already loaded');
      }

      return getRaceCalendarPromise;
    };

    /**
     * Determine if the logged in player has a pick for the specified year/race#
     * @param year
     * @param raceNumber
     * @returns {*}
     */
    F1QuickPickProxy.playerHasPick = function(year, raceNumber) {
      var myPromise;
      $log.info('f1QuickPickProxy.playerHasPick: season:', year, ', race:', raceNumber);

      myPromise = MyHttp
        .path(appConfig.apiAddress)
        .path('player/hasPick')
        .path(year)
        .path(raceNumber)
        .get(null, AuthService.getToken())
        .catch(function () {
          myPromise = null
        });

      return myPromise;
    };

    /**
     * Get the player's pick fopr the specified year/race
     * @param year
     * @param raceNumber
     * @returns {*}
     */
    F1QuickPickProxy.getPlayerPick = function(year, raceNumber) {
      var myPromise;
      $log.debug('f1QuickPickProxy.getPlayerPick: season:', year, ', race:', raceNumber);

      myPromise = MyHttp
        .path(appConfig.apiAddress)
        .path('player/pick')
        .path(year)
        .path(raceNumber)
        .get(null, AuthService.getToken())
        .catch(function () {
          myPromise = null
        });

      return myPromise;
    };

    /**
     * Get the race details for a specific year/race #
     * @param year - year of race
     * @param raceNumber - the number of the race
     * @returns {*}
     */
    F1QuickPickProxy.getRaceDetails = function(year, raceNumber) {
      var myPromise;
      $log.debug('f1QuickPickProxy.getRaceDetails: season:', year, ', race:', raceNumber);

      myPromise = MyHttp
        .path(appConfig.apiAddress)
        .path('raceDetails')
        .path(year)
        .path(raceNumber)
        .get(null, AuthService.getToken())
        .catch(function () {
          myPromise = null
        });

      return myPromise;
    };

    F1QuickPickProxy.submitPlayerPicks = function(year, raceNumber, picks) {
      var myPromise;

      myPromise = MyHttp
        .path(appConfig.apiAddress)
        .path('player')
        .path('pick')
        .post({year: year, raceNumber: raceNumber, picks: picks}, false, AuthService.getToken())
        .catch(function () {
          myPromise = null
        });

      return myPromise;
    };

    return F1QuickPickProxy;
  }

})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .service('playerManager', playerManager);


  // inject dependencies
  playerManager.$inject = ['$log', 'appConfig', '_', 'f1QuickPickProxy'];

  function playerManager($log, appConfig, _, f1QuickPickProxy){
    var PlayerManager = {};

    PlayerManager.noCall = function() {
      return;
    };

    /**
     * Using httpProxy service get the player's pick for the specified year/race
     * @param year
     * @param raceNumber
     */
    PlayerManager.getPlayerPick = function(year, raceNumber) {
      var playerPick = {};

      f1QuickPickProxy.getPlayerPick(year, raceNumber).then(
        function(pick) {
          if (_.isEmpty(pick)) {
            $log.debug('playerManager could not locate a pick for ', year, '/', raceNumber);
          } else {
            $log.debug('playerManager received player pick from server: ', pick);
          }
          playerPick = pick;
        }
      );

      return playerPick;
    };

    return PlayerManager;
  }

})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .service('raceManager', raceManager);


  // inject dependencies
  raceManager.$inject = ['$log', 'appConfig', 'moment', 'f1QuickPickProxy', 'Q', '$resource', '_'];

  function raceManager($log, appConfig, moment, f1QuickPickProxy, Q, $resource, _){
    var RaceManager = {};

    RaceManager.noCall = function() {
    };

    function getFlags() {
      var myPromise = Q.defer();

      $resource('/static/nationality-flags.json').get(function(data) {
        myPromise.resolve(data);
      });

      return myPromise.promise;
    }

    /**
     * determines the index of the upcoming race given the current date
     * @param races
     * @returns {number}
     */
    var getCurrentRaceIndex = function(races) {
      var now = appConfig.overrideCurrentDate ? moment(appConfig.overrideCurrentDate) : moment();
      var currentRaceIndex = -1;

      //locate the next upcoming race given today's date
      for (var i = 0, len = races.length; i < len; i++) {
        var raceDate = moment(races[i].race_date);

        if(moment(raceDate).isSameOrAfter(now, 'day')) {
          currentRaceIndex = i;
          break;
        }
      }

      return currentRaceIndex
    };

    /**
     * Calculate and return the last, current (upcoming), and next races
     * @returns {{}}
     */
    RaceManager.getRaceTrio = function() {
      var myPromise = Q.defer();
      var raceTrio = {};

      f1QuickPickProxy.getRaceCalendar().then(
        function(races) {
          var currentRaceIndex = getCurrentRaceIndex(races);
          if (currentRaceIndex == -1) return;

          raceTrio.currentRace = races[currentRaceIndex];
          raceTrio.currentRace.race_date_formatted = moment(races[currentRaceIndex].race_date).utc().format('ddd MMM Do YYYY, h:mm a Z') + ' (GMT)';

          //define the pick cutoff time as -28 hours from race time
          raceTrio.currentRace.cutoff_time = createMomentDateFromUTCString(raceTrio.currentRace.race_date).subtract(28, "hours");
          raceTrio.currentRace.cutoff_time_formatted = raceTrio.currentRace.cutoff_time.format('ddd MMM Do YYYY, h:mm a Z') + ' (GMT)';

          //first race of year
          if (currentRaceIndex == 0) {
            raceTrio.previousRace = null;
            raceTrio.nextRace = races[currentRaceIndex + 1];
          } else if (currentRaceIndex == races.length - 1) {
            //last race of year
            raceTrio.previousRace = races[currentRaceIndex - 1];
            raceTrio.nextRace = null;
          } else {
            //has previous and subsequent events
            raceTrio.previousRace = races[currentRaceIndex - 1];
            raceTrio.nextRace = races[currentRaceIndex + 1];
          }

          myPromise.resolve(raceTrio)
        }
      );

      return myPromise.promise;
    };

    /**
     * Transforms utc date in string to proper moment date object
     * @param utcDate
     * @returns {*}
     */
    function createMomentDateFromUTCString(utcDate) {
      var t = moment(utcDate);

      var utcTime = moment().set({
        'year': t.year(),
        'month': t.month(),
        'date': t.date(),
        'hour': t.hour(),
        'minute': t.minute(),
        'second': t.second()
      }).utc();
      //console.log('createMomentDateFromUTCString: ', utcDate , ' >>> ', newTime.utc());

      return utcTime;
    }

    /**
     * Calls proxy service to get race details for specified year/race#
     * @param year
     * @param raceNumber
     * @returns {*}
     */
    RaceManager.getRaceDetails = function(year, raceNumber) {
      var myPromise = Q.defer();

      f1QuickPickProxy.getRaceDetails(year, raceNumber).then(
        function(raceDetails) {
          myPromise.resolve(raceDetails)
        }
      );

      return myPromise.promise;
    };

    /**
     * Given a race object extract the drivers into a flatten object array including flag of nationality
     * @param race - the race db object
     */
    RaceManager.getRaceDrivers = function(race) {
      var myPromise = Q.defer();

      getFlags().then(function(promise){
        var flags = promise.flags;

        //race contains constructors array, which contains drivers array - extract drivers into array
        var raceDrivers = _.chain(_.map(race.constructors, function(value) {
          var constructor = value;
          return _.map(value.drivers, function(value) {
            var flag = _.find(flags, function(f) {return f.nationality == value.driver_nationality});
            return {driver_name: value.driver_name, driver_id: value.driver_id, driver_code: value.driver_code, driver_nationality: value.driver_nationality, driver_flag: flag.flag_sm, constructor_name: constructor.constructor_name};
          })
        })).flatten().value();

        myPromise.resolve(raceDrivers);
      });

      return myPromise.promise;
    };

    /**
     * Submit the player's picks to backend
     * @param year - race season year
     * @param raceNumber - number of race
     * @param picks - player's picks
     * @returns {*}
     */
    RaceManager.submitPlayerPicks = function(year, raceNumber, picks) {
      var myPromise = Q.defer();

      validatePlayerPicks(picks, function(err, msg) {
        if (err) {
          myPromise.reject(msg);
        } else {
          f1QuickPickProxy.submitPlayerPicks(year, raceNumber, picks).then(
            function(result) {
              myPromise.resolve(result);
            }
          );
        }
      });

      return myPromise.promise;
    };

    /**
     * validate the player's picks prior to attempting save to backend
     * @param picks - the player's picks
     * @param next
     * @returns {*}
     */
    function validatePlayerPicks(picks, next) {
      //make sure there are 10 picks
      var nullPick = _.find(picks, function(p){return p == "0"});
      if (nullPick > -1) {
        return next('error', 'You must select 10 drivers');
      }

      //make sure there are no duplicate picks
      var duplicates = _.filter(picks, function (value, index, iteratee) {
        return _.includes(iteratee, value, index + 1);
      });
      if (duplicates.length > 0) {
        return next('error', 'You must have no duplicate picks');
      }

      //make sure all picks are unique
      next(null, 'picks valid');
    }

    return RaceManager;
  }


})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .controller('raceResultsController', raceResultsController);

  raceResultsController.$inject = ['$log','MyHttp', 'ergastCalls'];

  function raceResultsController($log, MyHttp, ergastCalls) {
    var vm = this;
    vm.year = 2015;
    vm.race = 16;

    ergastCalls.noCall();

    //ergastCalls.getRaceSchedule(vm.year).then(function(results) {
    //  $log.debug('race schedule results for ', vm.year, ': ', results);
    //});

    //ergastCalls.getRaceResults(vm.year, vm.race).then(function(results) {
    //  $log.debug('race results for ', vm.year, '/', vm.race, ': ', results);
    //});

  }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .controller('calendarListController', calendarListController);

  calendarListController.$inject = ['$log', 'f1QuickPickProxy', 'moment', 'appConfig'];

  function calendarListController($log, f1QuickPickProxy, moment, appConfig) {
    var vm = this;
    vm.races;


    f1QuickPickProxy.getRaceCalendar(appConfig.season).then(
      function(races) {
        //$log.debug('races: ', races);
        vm.races = races;
      },
      function(err) {
        $log.error(err);
      }
    );

  }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .controller('appFooterController', appFooterController);

  appFooterController.$inject = ['appConfig', 'AuthService', 'moment'];

  function appFooterController(appConfig, AuthService, moment) {
    var vm = this;
    vm.overrideCurrentDate = appConfig.overrideCurrentDate ? moment(appConfig.overrideCurrentDate).utc().format('ddd MMM Do YYYY, h:mm a Z') : null;
    vm.loggedInUser = AuthService.currentUser();
    vm.placeholderText = "...";
  }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module("f1Quickpick")

    .controller('appHeaderController', appHeaderController);

  appHeaderController.$inject = ['$log', 'appConfig', 'AuthService'];

    function appHeaderController($log, appConfig, AuthService) {
      var vm = this;
      vm.appTitle = appConfig.appTitle;
      vm.loggedIn = AuthService.isLoggedIn();
      vm.player = AuthService.currentUser();
    }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('LoginController', LoginController);

    //inject dependencies
    LoginController.$inject = ['$scope', '$location', '$routeParams', '$log', 'AuthService', 'appConfig'];

    function LoginController($scope, $location, $routeParams, $log, AuthService, appConfig) {
      var vm = this;
      vm.title = appConfig.appTitle;

      if ($routeParams.username) {
        vm.loginForm = {username: $routeParams.username};
      } else {
        vm.loginForm = {};
      }
      //vm.loginForm = {username: 'user1', password: 'abc123'};

      $log.debug('Login Controller: getUserStatus: ', AuthService.currentUser());


      vm.login = function () {
        $log.debug('Attempting Login: ', vm.loginForm);

        // initial values
        vm.error = false;
        vm.disabled = true;

        // call login from service
        AuthService.login(vm.loginForm.username, vm.loginForm.password)
          // handle success
          .then(function () {
            $log.debug('loginCtrl: user logged in');
            $location.path('/');
            vm.disabled = false;
            vm.loginForm = {};
          })
          // handle error
          .catch(function () {
            $log.debug('loginCtrl: login error: Invalid username and/or password');
            vm.error = true;
            vm.errorMessage = "Invalid username and/or password";
            vm.disabled = false;
          });
      };
    }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('LogoutController', LogoutController);

  //inject dependencies
  LogoutController.$inject = ['$scope', '$location', '$log', 'AuthService', 'appConfig'];

  function LogoutController($scope, $location, $log, AuthService, appConfig) {
    var vm = this;
    vm.title = appConfig.appTitle;

    vm.logout = function() {
      $log.debug('Logging out user -  current status: ', AuthService.currentUser());

      AuthService.logout()
      .then( function() {
        $location.path('/login');
      })
    }
  }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('MainController', MainController);

  MainController.$inject = ['$log', 'appConfig', '_', 'raceManager', 'f1QuickPickProxy'];

  function MainController($log, appConfig, _, raceManager, f1QuickPickProxy) {
    var vm = this;
    vm.season = appConfig.season;
    vm.raceTrio = {};
    vm.title = appConfig.appTitle;
    vm.overrideCurrentDate = appConfig.overrideCurrentDate ? appConfig.overrideCurrentDate : null;
    vm.currentPick = null;
    vm.playerHasPick = false;


    raceManager.getRaceTrio().then(function(raceTrio){
      vm.raceTrio = raceTrio;
      $log.debug('raceTrio.currentRace:', raceTrio.currentRace);

      f1QuickPickProxy.playerHasPick(appConfig.season, raceTrio.currentRace.race_number).then(
        function(hasPick) {
          $log.debug('MainController - Player hasPick:', hasPick);
          vm.playerHasPick = hasPick;
        }
      );

    });
  }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('EditPlayerPickController', EditPlayerPickController);

  EditPlayerPickController.$inject = ['$scope', '$log', 'appConfig', '$routeParams', '_', 'f1QuickPickProxy', 'raceManager', '$location'];

  function EditPlayerPickController($scope, $log, appConfig, $routeParams, _, f1QuickPickProxy, raceManager, $location) {
    var vm = this;
    vm.raceTrio = {};
    vm.drivers = {};
    vm.duplicates = [];
    vm.playerPicks = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"]; //array contains all user's picks (defaults to the default 'pick driver' selection (0)

    //create a default pick which will be applied to top of drivers list array
    var defaultPick = {};
    defaultPick.driver_id = "0";
    defaultPick.driver_name = "- pick driver -";

    //define array that will contain alerts to be displayed to user
    vm.alerts = [];

    //display an alert to user by adding to alery array (types=success, info, or warning)
    vm.addAlert = function(type, message) {
      //only display one alert at a time (for now)
      vm.alerts = [];
      vm.alerts.push({type: type, msg: message});
      $scope.$apply();
    };

    //close the alert at specified alert array index
    vm.closeAlert = function(index) {
      vm.alerts.splice(index, 1);
    };

    /**
     * using the pick at the passed index look for a duplicate selection in the playerPicks array
     * @param pickNum - the index of the user's pick in the playerPicks array
     * @returns {boolean} - true if duplicate pick exists, false if not
     */
    vm.checkForDuplicate = function(pickNum) {
      if(vm.playerPicks[pickNum] == 0) return false;
      var result = _.findIndex(vm.duplicates, function(d) { return d == vm.playerPicks[pickNum] });
      return result > -1;
    };

    /**
     * handle all player pick selection changes
     */
    vm.pickSelected = function() {
      //record any duplicate picks in the 'duplicates' var
      vm.duplicates = _.filter(vm.playerPicks, function (value, index, iteratee) {
        if (value == 0) return;
        return _.includes(iteratee, value, index + 1);
      });
    };

    /**
     * Submit player picks to server/db
     */
    vm.submit = function() {
      raceManager.submitPlayerPicks(vm.raceTrio.currentRace.year, vm.raceTrio.currentRace.race_number, vm.playerPicks).then(function(result){
        if (result.status != 200) {
          vm.addAlert('warning', result.data);
        } else {
          $location.path('/view-player-pick');
          vm.addAlert('success', 'Player pick saved');
        }
      }).fail(function(err) {
        vm.addAlert('warning', err);
      })
    };

    /**
     * reset the player picks back to all unselected
     */
    vm.reset = function() {
      vm.playerPicks = ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0"];
    };

    /**
     * get the latest race info, build the current race's drivers list
     */
    raceManager.getRaceTrio().then(function(raceTrio){
      vm.raceTrio = raceTrio;

      raceManager.getRaceDrivers(vm.raceTrio.currentRace).then(function(drivers) {
        vm.drivers = drivers;
        vm.drivers.unshift(defaultPick); //apply default pick to top of array

        //$log.debug('race:', vm.raceTrio.currentRace);
        //$log.debug('drivers:', vm.drivers);
        $scope.$apply();
      });

      //if the player has a pick, then retrieve it from db now
      if ($routeParams.hasplayerpick === "true") {
        f1QuickPickProxy.getPlayerPick(appConfig.season, raceTrio.currentRace.race_number).then(
          function(picks) {
            if(_.isEmpty(picks)) {
              $log.debug('EditPlayerPickController - no pick located for season:', appConfig.season, ', race:',raceTrio.currentRace.race_number);
            } else {
              vm.playerPicks = picks[0].picks;
              $log.debug('EditPlayerPickController - picks:', vm.playerPicks);
            }
          }
        );
      }
    });
  }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('ViewPlayerPickController', ViewPlayerPickController);

  ViewPlayerPickController.$inject = ['$scope', '$log', 'appConfig', '$routeParams', '_', 'f1QuickPickProxy', 'raceManager', 'moment', '$location'];

  function ViewPlayerPickController($scope, $log, appConfig, $routeParams, _, f1QuickPickProxy, raceManager, moment, $location) {
    var vm = this;
    vm.raceTrio = {};
    vm.allDrivers = {};
    vm.selectedDrivers = {};
    vm.playerPicks = {};
    vm.editAllowed = false;

    /**
     * get the latest race info, build the current race's drivers list
     */
    raceManager.getRaceTrio().then(function(raceTrio){
      vm.raceTrio = raceTrio;

      //allow editing only when current date < current race cutoff
      var currentDate = appConfig.overrideCurrentDate ? appConfig.overrideCurrentDate : new Date();
      currentDate = moment(currentDate);

      $log.debug('>>>>>currentDate:', currentDate);
      $log.debug('>>>>>>cutOffDate:', moment(vm.raceTrio.currentRace.cutoff_time));

      if(moment(vm.raceTrio.currentRace.cutoff_time).isSameOrAfter(currentDate, 'minute')) {
        vm.editAllowed = true;
      }

      raceManager.getRaceDrivers(vm.raceTrio.currentRace).then(function(drivers) {
        vm.allDrivers = drivers;
        $log.debug('allDrivers:', vm.allDrivers);

        f1QuickPickProxy.getPlayerPick(appConfig.season, raceTrio.currentRace.race_number).then(
          function(picks) {
            if(_.isEmpty(picks)) {
              $log.debug('ViewPlayerPickController - no pick located for season:', appConfig.season, ', race:',raceTrio.currentRace.race_number);
            } else {
              vm.playerPicks = picks[0].picks;

              vm.selectedDrivers = _.map(vm.playerPicks, function(pick){
                return _.find(vm.allDrivers, function(d) {return d.driver_id == pick});
              });

              $log.debug('ViewPlayerPickController - picks:', vm.playerPicks);
              $log.debug('ViewPlayerPickController - selectedDrivers:', vm.selectedDrivers);
            }
          }
        );

      });

    });

    vm.edit = function() {
      $log.debug('>>>>>editing...');
      $location.path('/edit-player-pick/true');
    }
  }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('RegistrationController', RegistrationController);

  //inject dependencies
  RegistrationController.$inject = ['$scope', '$location', '$log', 'AuthService', 'appConfig'];

  function RegistrationController($scope, $location, $log, AuthService, appConfig) {
    var vm = this;
    vm.title = appConfig.appTitle;

    vm.registerForm = {
      username: "",
      password: "",
      confirmPassword: ""
    };
    //vm.registerForm.username = 'user1';
    //vm.registerForm.password = 'abc123';

    $log.debug('Registration - current user status: ', AuthService.currentUser());

    vm.register = function () {
      $log.debug('Registering new player: vm: ', vm.registerForm.username);

      // initial values
      vm.error = false;
      vm.disabled = true;

      // call register from service
      AuthService.register(vm.registerForm.username, vm.registerForm.password)
        // handle success
        .then(function () {
          $location.path('/registrationConfirmation/' + vm.registerForm.username); //$location.path('/login');
          vm.disabled = false;
          vm.registerForm = {};
        })
        // handle error
        .catch(function (err) {
          $log.debug('err: ', err);
          vm.error = true;
          vm.errorMessage = (err.status == 409) ? "Username " + vm.registerForm.username + " already exists. Please use another." : "We're sorry, we are unable to register you at this time. Please try again later.";
          vm.disabled = false;
          vm.registerForm = {};
        });
    };
  }
})();
}());

;(function() {
"use strict";

(function() {
  'use strict';

  angular

    .module('f1Quickpick')

    .controller('RegistrationConfirmationController', RegistrationConfirmationController);

  //inject dependencies
  RegistrationConfirmationController.$inject = ['$scope', '$routeParams'];

  function RegistrationConfirmationController($scope, $routeParams) {
    var vm = this;
    vm.username = $routeParams.username;
  }
})();
}());

;(function() {
"use strict";

angular.module("f1Quickpick").run(["$templateCache", function($templateCache) {$templateCache.put("raceResults/raceResults.ng.template.html","<div>\n  <b>Race Results for {{rr.year}}/Race {{rr.race}}</b>\n  <form>\n    Year1:<input type=\"number\" ng-model=\"rr.year\" name=\"year\" min=\"1950\" max=\"2015\"/>\n    Race1:<input type=\"number\" ng-model=\"rr.race\" name=\"race\" min=\"1\" max=\"20\"/>\n  </form>\n</div>\n");
$templateCache.put("components/calendar-list/calendar-list.ng.template.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"small-8 f1-title columns\">\n      <ul>\n        <li ng-repeat=\"(index, race) in vm.races\">{{race.race_name}}</li>\n      </ul>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/footer/footer.ng.template.html","<div class=\"container\" style=\"margin-top: 15px;\">\n  <div class=\"row footer-row\">\n    <div class=\"small-12 columns\" style=\"font-size: 8pt; color: red; text-align: right; background: aliceblue;\">\n      <div ng-if=\"vm.overrideCurrentDate\" style=\"float: left;\">current user: {{vm.loggedInUser}}</div>\n      <div ng-if=\"vm.overrideCurrentDate\" style=\"float: left; margin-left: 15px;\">date override: {{vm.overrideCurrentDate}}</div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/header/header.ng.template.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"small-8 f1-title columns\">\n      <a href=\"#/\">{{vm.appTitle}}</a>\n    </div>\n    <div class=\"small-4 f1-title columns\" ng-if=\"vm.loggedIn\">\n      <div style=\"float: left\"><a href=\"/profile/{{ vm.player }}\">My Profile</a></div>\n      <div class=\"divider\"  style=\"float: right\"></div>\n      <div style=\"float: right\" ng-controller=\"LogoutController as loc\"><a ng-click=\"loc.logout()\" style=\"cursor: pointer\">Logout</a></div>\n    </div>\n    <div class=\"small-4 f1-title columns\" ng-if=\"!vm.loggedIn\">\n      &nbsp;\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/login/login.ng.template.html","<app-header></app-header>\n\n\n<div class=\"row\">\n  <div class=\"medium-6 medium-offset-3 columns\">\n    <h2>Login</h2>\n    <div ng-show=\"vm.error\" class=\"alert alert-danger\">{{vm.errorMessage}}</div>\n    <form name=\"form\" ng-submit=\"vm.login()\" role=\"form\">\n      <div class=\"form-group\" ng-class=\"{ \'has-error\': form.username.$dirty && form.username.$error.required }\">\n        <label for=\"username\">Username</label>\n        <input type=\"text\" name=\"username\" id=\"username\" class=\"form-control\" ng-model=\"vm.loginForm.username\" required />\n        <span ng-show=\"form.username.$dirty && form.username.$error.required\" class=\"help-block\">Username is required</span>\n      </div>\n      <div class=\"form-group\" ng-class=\"{ \'has-error\': form.password.$dirty && form.password.$error.required }\">\n        <label for=\"password\">Password</label>\n        <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" ng-model=\"vm.loginForm.password\" required />\n        <span ng-show=\"form.password.$dirty && form.password.$error.required\" class=\"help-block\">Password is required</span>\n      </div>\n      <div class=\"form-actions\">\n        <button type=\"submit\" ng-disabled=\"form.$invalid || vm.disabled\" class=\"btn btn-primary\">Login</button>\n        <img ng-if=\"vm.dataLoading\" src=\"data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==\" />\n        <a href=\"#/register\" class=\"btn btn-link\">Register</a>\n      </div>\n    </form>\n  </div>\n</div>\n\n<app-footer></app-footer>\n");
$templateCache.put("components/main/main.ng.template.html","<app-header></app-header>\n\n<div class=\"row\" style=\"margin-top: 18px;\">\n  <div class=\"small-4 columns\">\n    <calendar-list></calendar-list>\n  </div>\n  <div class=\"small-8 columns\">\n    <div class=\"row\">\n      <div class=\"small-12 columns\" style=\"height: 25px;\"></div>\n    </div>\n    <div class=\"row\">\n      <div class=\"small-12 columns\" style=\"text-align: center\">\n        <h2>Current Season: {{vm.season}}</h2>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"small-12 columns\" style=\"text-align: center\">\n        <h3>Upcoming Race</h3>\n      </div>\n    </div>\n    <div class=\"row\" ng-if=\"!vm.raceTrio.currentRace\">\n      <div class=\"small-12 columns\" style=\"text-align: center\">\n        <h4>No Races Currently Set</h4>\n      </div>\n    </div>\n    <div class=\"row\" ng-if=\"vm.raceTrio.currentRace\">\n        <div class=\"small-12 columns\" style=\"text-align: center\">\n          <h4>{{vm.raceTrio.currentRace.race_name}}</h4>\n        </div>\n        <div class=\"small-12 columns\" style=\"text-align: center\">\n          <h4>{{vm.raceTrio.currentRace.race_date_formatted}}</h4>\n        </div>\n        <div class=\"small-12 columns\" style=\"text-align: center\" ng-if=\"vm.playerHasPick\">\n          <h4><a href=\"#/view-player-pick\">View my picks</a></h4>\n        </div>\n        <div class=\"small-12 columns\" style=\"text-align: center\" ng-if=\"!vm.playerHasPick\">\n          <h4><a href=\"#/edit-player-pick/false\">Select my picks</a></h4>\n        </div>\n    </div>\n  </div>\n</div>\n\n<app-footer></app-footer>\n");
$templateCache.put("components/player-pick/edit-player-pick.ng.template.html","<app-header></app-header>\n\n<script>\n  $(document).on(\'close.fndtn.alert\', function(event) {\n    console.info(\'An alert box has been closed!\');\n  });\n</script>\n\n<div class=\"row\" style=\"margin-top: 18px;\">\n  <div class=\"small-12 columns\">\n    <div style=\"width: 50%; margin: 0 auto;\">\n      Select your picks for the {{vm.raceTrio.currentRace.year}} {{vm.raceTrio.currentRace.race_name}}\n    </div>\n  </div>\n</div>\n\n<div class=\"row\" style=\"margin-top: 7px;\">\n  <div>\n    <alert ng-repeat=\"alert in vm.alerts\" type=\"alert.type\" close=\"vm.closeAlert($index)\" style=\"text-align: center; font-size: larger;\">{{alert.msg}}</alert>\n  </div>\n\n  <div class=\"small-12 columns\">\n    <div data-ng-repeat=\"pick in [1,2,3,4,5,6,7,8,9,10]\" style=\"width: 50%; margin: 0 auto;\">\n      <div class=\"row\" style=\"margin-top: 3px;\">\n        <div class=\"small-12 columns\">\n          <div class=\"pick-position-indicator\">{{pick}}</div>\n          <select class=\"pick-selector\"\n                  name=\"pickSelector{{pick}}\"\n                  id=\"pickSelector{{pick}}\"\n                  ng-model=\"vm.playerPicks[pick-1]\"\n                  ng-change=\"vm.pickSelected()\"\n                  ng-style=\"{background: vm.checkForDuplicate(pick-1) == true ? \'#EF9292\' : \'#FFFFFF\'}\">\n            <option ng-repeat=\"driver in vm.drivers\" value=\"{{driver.driver_id}}\" style=\"background: #FFFFFF\">\n              {{driver.constructor_name}} - {{driver.driver_name}}\n            </option>\n          </select>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class=\"row\" style=\"margin-top: 7px;\">\n  <div class=\"small-12 columns\" style=\"text-align: center;\">\n    <button style=\"height: 37px; line-height: 0px;\" ng-click=\"vm.submit()\">Submit</button>\n    <button style=\"height: 37px; line-height: 0px;\" ng-click=\"vm.reset()\">Reset</button>\n  </div>\n</div>\n\n<app-footer></app-footer>\n");
$templateCache.put("components/player-pick/view-player-pick.ng.template.html","<app-header></app-header>\n\n<div class=\"row\" style=\"margin-top: 18px;\">\n  <div class=\"small-12 columns\">\n    <div style=\"width: 40%; margin: 0 auto;\">\n      <span><b>Your picks for the {{vm.raceTrio.currentRace.year}} {{vm.raceTrio.currentRace.race_name}}</b></span>\n      <ul style=\"list-style-type:none; margin-top:10px;\">\n        <li ng-repeat=\"driver in vm.selectedDrivers\">{{$index+1}} {{driver.constructor_name}} - {{driver.driver_name}}</li>\n      </ul>\n\n      <div><b>You may edit your picks until</b></div>\n      <div>{{vm.raceTrio.currentRace.cutoff_time_formatted}}</div>\n      <div style=\"margin: auto; margin-top: 10px;\" ng-if=\"vm.editAllowed\">\n        <button style=\"height: 37px; line-height: 0px; float: right;\" ng-click=\"vm.edit()\">Edit</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<app-footer></app-footer>\n");
$templateCache.put("components/registration/registration.ng.template.html","<app-header></app-header>\n\n  <div class=\"row\">\n    <div class=\"medium-6 medium-offset-3 columns\">\n      <h2>Register for {{vm.title}}</h2>\n      <div ng-show=\"vm.error\" class=\"alert alert-danger\">{{vm.errorMessage}}</div>\n      <form name=\"registrationForm\" novalidate ng-submit=\"vm.register()\">\n        <div class=\"form-group\" ng-class=\"{ \'has-error\': registrationForm.username.$touched && registrationForm.username.$invalid }\">\n          <input type=\"text\" class=\"form-control\" name=\"username\" placeholder=\"Username\" ng-model=\"vm.registerForm.username\" required />\n          <div ng-messages=\"registrationForm.username.$error\" ng-show=\"registrationForm.username.$touched\" role=\"alert\">\n            <div ng-messages-include=\"components/registration/registrationMessages.ng.template.html\"></div>\n          </div>\n        </div>\n        <div class=\"form-group\">\n          <input type=\"password\" class=\"form-control\" name=\"password\" placeholder=\"Password\" ng-model=\"vm.registerForm.password\" required>\n          <div ng-messages=\"registrationForm.password.$error\" ng-show=\"registrationForm.password.$touched\">\n            <div ng-messages-include=\"components/registration/registrationMessages.ng.template.html\"></div>\n          </div>\n        </div>\n        <div class=\"form-group\">\n          <input type=\"password\" class=\"form-control\" name=\"confirmPassword\" placeholder=\"Confirm Password\" ng-model=\"vm.registerForm.confirmPassword\" required compare-to=\"vm.registerForm.password\">\n          <div ng-messages=\"registrationForm.confirmPassword.$error\" ng-show=\"registrationForm.confirmPassword.$touched\">\n            <div ng-messages-include=\"components/registration/registrationMessages.ng.template.html\"></div>\n          </div>\n        </div>\n        <div>\n          <button type=\"submit\" class=\"btn btn-default\" ng-disabled=\"registrationForm.$invalid\">Register</button>\n        </div>\n      </form>\n    </div>\n  </div>\n\n<app-footer></app-footer>\n");
$templateCache.put("components/registration/registrationConfirmation.ng.template.html","<my-header></my-header>\n\n<div class=\"medium-6 medium-offset-3 columns\">\n  <h2>Welcome {{vm.username}}</h2>\n  <h2>Thanks for joining F1 QuickPick!</h2>\n  <h3><a ng-href=\"#/login/{{vm.username}}\">Login</a> to get started!</h3>\n</div>\n");
$templateCache.put("components/registration/registrationMessages.ng.template.html","<div class=\"messages\">\n  <div ng-message=\"required\">Required</div>\n  <div ng-message=\"minlength\">Too short</div>\n  <div ng-message=\"maxlength\">Too long</div>\n  <div ng-message=\"email\">Invalid email address</div>\n  <div ng-message=\"compareTo\">Must match the previous entry</div>\n</div>\n");}]);
}());

;(function() {
"use strict";

angular

.module("f1Quickpick")

.directive('raceResults', function() {
    return {
      restrict: 'E'
      , transclude: true
      , replace: true
      , scope: true
      , controller: 'raceResultsController'
      , controllerAs: 'rr'
      , templateUrl: 'raceResults/raceResults.ng.template.html'
    };
  });
}());

;(function() {
"use strict";

angular

  .module("f1Quickpick")

  .directive('calendarList', function() {
    return {
      restrict: 'E'
      , transclude: true
      , replace: true
      , scope: true
      , controller: 'calendarListController'
      , controllerAs: 'vm'
      , templateUrl: 'components/calendar-list/calendar-list.ng.template.html'
    };
  });
}());

;(function() {
"use strict";

angular

  .module("f1Quickpick")

  .directive('appFooter', function() {
    return {
      restrict: 'E'
      , transclude: true
      , replace: true
      , scope: true
      , controller: 'appFooterController'
      , controllerAs: 'vm'
      , templateUrl: 'components/footer/footer.ng.template.html'
    };
  });
}());

;(function() {
"use strict";

angular

  .module("f1Quickpick")

  .directive('appHeader', function() {
    return {
      restrict: 'E'
      , transclude: true
      , replace: true
      , scope: true
      , controller: 'appHeaderController'
      , controllerAs: 'vm'
      , templateUrl: 'components/header/header.ng.template.html'
    };
  });
}());

;(function() {
"use strict";

angular

  .module("f1Quickpick")

  .directive('compareTo', function() {

    return {
      require: "ngModel",
      scope: {
        otherModelValue: "=compareTo"
      },
      link: function(scope, element, attributes, ngModel) {

        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue == scope.otherModelValue;
        };

        scope.$watch("otherModelValue", function() {
          ngModel.$validate();
        });
      }
    };

  });
}());
