(function () {
  'use strict'

  var navBar = {
    controller: navCtrl,
    templateUrl: "app/components/navbar/navBar.html"
  }

  navCtrl.$inject = ["authfire"]
  function navCtrl(authfire) {
    var nav = this;
    nav.auth = authfire;
    nav.user = authfire.auth.$getAuth();

    nav.auth.auth.$onAuthStateChanged(function (userData) {
      if (userData) {
        if (userData.email == "angelo@jelpmi.mx"){
          nav.img = "https://pbs.twimg.com/profile_images/581657354413867008/mVT0kfsJ.jpg"
        }
        console.log(userData.email)
      }
      console.log(nav.img)
    })
  }


  angular
    .module("jelpMiAdmin")
    .component("navBar", navBar)
})();