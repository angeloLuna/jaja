(function () {
    'use strict'

    angular
        .module('jelpMi')
        .config(config)
        .factory("Auth", ["$firebaseAuth",
          function($firebaseAuth) {
            var auth = $firebaseAuth()
            return auth;
          }
        ])
        .run(["$rootScope", "$location","$firebaseAuth",function($rootScope, $location,$firebaseAuth) {
          $firebaseAuth().$onAuthStateChanged(function(user){
            if(!user && $location.path() != "/login"){
              if($location.path() != "/registro")
              $location.path("/login")
            }
          })
          $rootScope.$on("$routeChangeSuccess", function(event, next, previous, error) {
            //if( typeof next.$$route == "undefined"){
              //return false;
            //}
            if(next.$$route.auth){
              var auth = $firebaseAuth();
              var user = null;
              auth.$onAuthStateChanged(function(user){
                console.info("iniciando")
                if(user){
                  //auth_info.info = {}
                  //auth_info.info.email = user.email;
                }else{
                  $location.path("/login");
                }
              });
            }else{
              var auth = $firebaseAuth();
              auth.$onAuthStateChanged(function(user){
                if(user && next.$$route.onlyanonymous){
                  $location.path("/");
                }
              });
            }
          });
        }]);


    config.$inject = ["$routeProvider", "$locationProvider","$httpProvider" ,"$compileProvider"];
    function config($routeProvider, $locationProvider, $httpProvider,$compileProvider) {

      // HTML 5 MODE ROUTE
      // $locationProvider.html5Mode({
      //  enabled: true,
      //  requireBase: false
      // });
      $httpProvider.useApplyAsync(true);
      $compileProvider.debugInfoEnabled(false);

        $routeProvider
            .when('/',{
                template:'<home-jelp></home-jelp>',
                auth : true,
                resolve: {user: resolveUser}
            })
            .when('/login',{
                template:'<log-in></log-in>',
                auth : false,
                onlyanonymous : true,
            })
            .when('/agendado',{
                template:'<servicio-jelp></servicio-jelp>',
                auth : true,
                resolve: {
                  // controller will not be loaded until $waitForSignIn resolves
                  // Auth refers to our $firebaseAuth wrapper in the factory below
                  "currentAuth": ["Auth", function(Auth) {
                    // $waitForSignIn returns a promise so the resolve waits for it to complete
                    return Auth.$waitForSignIn();
                  }]
                }
            })
            .when('/promos',{
                template:'<promos-jelp></promos-jelp>',
                auth : true,
              resolve: {
                // controller will not be loaded until $waitForSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                  // $waitForSignIn returns a promise so the resolve waits for it to complete
                  return Auth.$waitForSignIn();
                }]
              }
            })
            .when('/registro',{
                template:'<registro-jelp></registro-jelp>',
                auth : false,
                onlyanonymous : true,
            })
            .when('/datos',{
                template:'<mis-datos></mis-datos>',
                auth: true,
                resolve: {user: resolveUser}
            })
            .when('/express',{
                template:'<servicio-express></servicio-express>',
                auth: true,
              resolve: {
                // controller will not be loaded until $waitForSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                  // $waitForSignIn returns a promise so the resolve waits for it to complete
                  return Auth.$waitForSignIn();
                }]
              }
            })

            .otherwise('/')
    }

    resolveUser.$inject = ['authfire'];
    function resolveUser(authfire) {
      return authfire.auth.$requireSignIn();
    }

})();