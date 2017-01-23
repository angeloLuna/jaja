(function(){
  'use strict'

  angular
    .module("jelpMi")
    .service("profileService", profileService)

    profileService.$inject = ["$firebaseArray", "authfire", "$firebaseAuth"]
    function profileService($firebaseArray, authfire, $firebaseAuth){
      /*var prof = this;
      var ref = firebase.database().ref("rama")
      var auth = authfire;
      var list = $firebaseArray(ref);
      console.log("aquiiiiii")

      $firebaseAuth().$onAuthStateChanged(function(userData){
        if(userData){
          console.log("si hay")
          prof.uid = userData.uid
          console.log("uid",prof.uid)
          prof.uidResolve = angular.copy(prof.uid)
        } else {
          console.log("vale madres")
        }
      })*/
    }
})();