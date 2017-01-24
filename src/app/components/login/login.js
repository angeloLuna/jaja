(function () {
  'use strict'
  var login = {
    controller: loginCtrl,
    templateUrl: "app/components/login/login.html"
  }

  angular
    .module("jelpMiAdmin")
    .component("loginJelp", login)

  loginCtrl.$inject = ["$location", "authfire"];
  function loginCtrl($location, authfire) {
    var login = this;
    login.auth = authfire;


    login.logIn = function () {
      login.auth.auth.$signInWithEmailAndPassword(login.email, login.password)
        .then(success).catch(function (error) {
        if (error.code == 'auth/user-not-found') {
          login.usuarioInvalido = true
        } else if (error.code == 'auth/invalid-email') {
          login.correoInvalido = true
        } else if (error.code == 'auth/wrong-password') {
          login.usuarioInvalido = true;
        }
        console.log(error.code)
      })
    };



  }
})();