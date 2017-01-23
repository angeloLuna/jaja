(function(){
    'use strict'

    var navBar = {
        controller: navCtrl,
        templateUrl: "app/components/navbar/navbar.html"
    }


    navCtrl.$inject = ["$location", "authfire", "$firebaseArray", "$firebaseObject", "profileService"]
    function navCtrl($location,authfire, $firebaseArray, $firebaseObject, profileService){
      var nav = this;
      nav.user = authfire;
      var ref = firebase.database().ref("usuario")
      var array = $firebaseArray(ref)


      nav.user.auth.$onAuthStateChanged(function(userData){
        if (userData) {
          console.log("este essss",userData.uid)
          nav.uid = userData.uid;
          
          ref.orderByKey().equalTo(nav.uid).on('value',
            function(data){
              var _user = data.val()
              var k = nav.uid;
              nav.profile = _user[k]
              if (nav.profile) {
                nav.name = nav.profile.nombre;
              } 
            })
        }
      })


      this.logOut = function(){
        this.user.user = null
        this.user.auth.$signOut();
      }

      $(".button-collapse").sideNav();
    }
    angular
        .module("jelpMi")
        .component("navBar", navBar)
})();